
"use strict"




const promise = require('../commons/promise')





const repository = (commitFacts, blameFacts) => {

	const stats = {
		commits: commitFacts.length,
		authors: { }
	}

	commitFacts.forEach(commit => {

		const committer = commit.committer.name

		if (!stats.authors.hasOwnProperty(committer)) {

			stats.authors[committer] = {
				count: 1
			}

		} else {

			stats.authors[committer].count++

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

			if (!authorFileStats.hasOwnProperty(authorBlame.path)) {

				authorFileStats[authorBlame.path] = {
					authorLines: authorBlame.count,
					totalLines:  fileLines,
					percent:     parseFloat((authorBlame.count / fileLines).toFixed(2))
				}

			} else {

				authorFileStats.files[authorBlame.path].lines += authorBlame.count

			}

			if (!authorStats.lineCount) {
				authorStats.lineCount = authorBlame.count
			} else {
				authorStats.lineCount += authorBlame.count
			}

		})

	})

	Object.keys(stats.authors).forEach(author => {
		stats.authors[author].percent = parseFloat((stats.authors[author].count / stats.commits).toFixed(2))
	})

	return stats

}





module.exports = repository
