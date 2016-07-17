
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

		Object.keys(blame).forEach(author => {

			//stats.authors[author].files = stats.authors[author].files || { }

			console.log(blame)

		})

	})

	Object.keys(stats.authors).forEach(author => {
		stats.authors[author].percent = parseFloat((stats.authors[author].count / stats.commits).toFixed(2))
	})

	return stats

}





module.exports = repository
