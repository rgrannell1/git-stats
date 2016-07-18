
"use strict"




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

		stats.authors[key] = {
			commits:    elems.length,
			totalLines: 0
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

		stats.authors[key] = {
			files:      filesLineCounts,
			extensions: extensionLineCounts
		}

	})

	/*

	blameFacts.forEach(blame => {

		Object.keys(blame.authors).forEach(author => {

			const authorBlame = blame.authors[author]

			if (!stats.authors[author]) {
				stats.authors[author] = { }
			}

			const authorStats = stats.authors[author]

			authorStats.files     = authorStats.files || { }
			const authorFileStats = authorStats.files

			if (!authorStats.files) {
				authorStats.files = { }
			}

			if (!authorStats.extensions) {
				authorStats.extensions = { }
			}

			const extension = path.extname(authorBlame.path)

			if (!authorStats.extensions[extension]) {

				authorStats.extensions[extension] = {
					count:      1,
					totalLines: fileLines
				}

			} else {

				authorStats.extensions[extension].count++
				authorStats.extensions[extension].totalLines += fileLines

			}

			if (!authorFileStats.hasOwnProperty(authorBlame.path)) {

				authorFileStats[authorBlame.path] = {
					authorLines: authorBlame.count,
					totalLines:  fileLines,
					linePercent: parseFloat((authorBlame.count / fileLines).toFixed(2)) || 0
				}

			} else {

				authorFileStats.files[authorBlame.path].lines += authorBlame.count

			}

			if (!authorStats.collaborators) {
				authorStats.collaborators = { }
			}

			if (!authorStats.lineCount) {
				authorStats.lineCount = authorBlame.count
			} else {
				authorStats.lineCount += authorBlame.count
			}

			stats.lines += authorBlame.count

		})

	})

	Object.keys(stats.authors).forEach(author => {
		stats.authors[author].commitPercent = parseFloat((stats.authors[author].commits / stats.commits).toFixed(2)) || 0
	})


	*/

	return stats

}





module.exports = repository
