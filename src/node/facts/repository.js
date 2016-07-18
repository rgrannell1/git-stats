
"use strict"




const path    = require('path')
const promise = require('../commons/promise')





const repository = (commitFacts, blameFacts) => {

	const stats = {
		commits: commitFacts.length,
		lines:   0,
		authors: { }
	}

	commitFacts.forEach(commit => {

		const committer = commit.committer.name

		if (!stats.authors.hasOwnProperty(committer)) {

			stats.authors[committer] = {
				commits: 1,
				totalLines: 0
			}

		} else {

			stats.authors[committer].commits++

		}

	})

	blameFacts.forEach(blame => {

		const fileLines = Object.keys(blame.authors)
			.map(author => blame.authors[author].count)
			.reduce((num0, num1) => num0 + num1, 0)

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

	return stats

}





module.exports = repository
