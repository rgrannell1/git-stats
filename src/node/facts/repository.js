
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

		const firstDate = utils.minBy(commit => {
			return commit.author.when.time
		}, elems).author.when.time

		const past    = moment(1000 * firstDate)
		const present = moment(Date.now( ))

		const totalCommittingDays = present.diff(past, 'days')

		const commitsByDay = utils.groupBy(commit => {
			return commit.author.when.timeParts.join('')
		}, elems)

		const averageCommitsPerActiveDay = utils.average(pair => {
			return pair.elems.length
		}, commitsByDay)

		const averageCommitsPerDay = (averageCommitsPerActiveDay * commitsByDay.length) / totalCommittingDays

		stats.authors[key] = {
			commits:             elems.length,
			commitsPerDay:       parseFloat(averageCommitsPerDay.toFixed(2), 10),
			commitsPerActiveDay: parseFloat(averageCommitsPerActiveDay.toFixed(2), 10),
			daysWithCommits:     commitsByDay.length
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
