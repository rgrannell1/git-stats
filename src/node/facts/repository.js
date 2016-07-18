
"use strict"



const moment  = require('moment')

const path    = require('path')
const promise = require('../commons/promise')
const utils   = require('../commons/utils')





const repository = (commitFacts, blameFacts) => {

	const stats = {
		commits: commitFacts.length,
		lines:   0,
		authors: { }
	}

	const commitsByAuthor = utils.groupBy(commit => {
		return commit.committer.name
	}, commitFacts)

	commitsByAuthor.forEach(({key, elems}) => {

		// TODO use a better metric. Stick in loop.

		const commitExtremes = {
			min: utils.minBy(commit => commit.timeMs, elems),
			max: utils.maxBy(commit => commit.timeMs, elems)
		}

		const past        = moment(commitExtremes.min.author.when.time * 1000)
		const present     = moment(Date.now( ))

		const totalCommittingDays = present.diff(past, 'days')

		const commitsByDay = utils.groupBy(commit => {
			return commit.author.when.timeParts.join('')
		}, elems)

		const averageCommitsPerActiveDay = utils.average(pair => {
			return pair.elems.length
		}, commitsByDay)

		const averageCommitsPerDay = (averageCommitsPerActiveDay * commitsByDay.length) / totalCommittingDays

		const messages     = elems.map(elem => elem.message)
		const messageTable = utils.tabulate(elem => {
			return elem.trim( )
		}, messages)

		const commonMessages  = messageTable.slice(-10).filter(data => data.count >= 3).map(data => data.key)
		const linesPerMessage = utils.average(message => message.split('\n').length - 1, messages)

		const commitHours = elems.map(commit => moment(commit.timeMs).get('hour'))
		const commitHoursTable = utils.tabulate(x => x, commitHours)
			.map(({key, count}) => ({
				hour: key, commits: count
			}))
			.sort((elem0, elem1) => elem0.hour - elem1.hour)

		stats.authors[key] = {
			commits:             elems.length,
			commitsPerDay:       parseFloat(averageCommitsPerDay.toFixed(2), 10),
			commitsPerActiveDay: parseFloat(averageCommitsPerActiveDay.toFixed(2), 10),
			daysWithCommits:     commitsByDay.length,
			commitHours:         commitHoursTable,
			commitRange: {
				oldest: moment(commitExtremes.min.timeMs).format('MMMM Do YYYY, h:mm:ss a'),
				newest: moment(commitExtremes.max.timeMs).format('MMMM Do YYYY, h:mm:ss a')
			},
			commonMessages,
			linesPerMessage
		}

	})

	const hunks = blameFacts.reduce((hunks, facts) => {
		return hunks.concat(facts.hunks)
	}, [ ])

	stats.lines = hunks.reduce((acc, hunk) => acc + hunk.lines, 0)

	const blameByAuthor = utils.groupBy(hunk => {
		return hunk.author
	}, hunks)

	const fileLines = hunks.reduce((acc, hunk) => {
		return acc + hunk.lines
	}, 0)

	blameByAuthor.forEach(({key, elems}) => {

		const filesByAuthor = utils.groupBy(hunk => {
			return hunk.path
		}, elems)

		const filesLineCounts = filesByAuthor.map(({key, elems}) => {

			return {
				path: key,
				lineCount: elems.reduce((acc, elem) => acc + elem.lines, 0),
				hunkCount: elems.length
			}

		})

		const extensionsByAuthor = utils.groupBy(hunk => {
			return path.extname(hunk.path)
		}, elems)

		const extensionLineCounts = extensionsByAuthor.map(({key, elems}) => {

			return {
				extension: key,
				lineCount: elems.reduce((acc, elem) => acc + elem.lines, 0),
				fileCount: elems.length
			}

		})

		stats.authors[key] = Object.assign({ }, {

			files:      filesLineCounts,
			extensions: extensionLineCounts,
			totalLines: elems.reduce((acc, elem) => acc + elem.lines, 0)

		}, stats.authors[key])

	})

	return stats

}





module.exports = repository
