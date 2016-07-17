
"use strict"





const displayStats = factEmitter => {

	const authorStats = { }

	factEmitter
		.on('commit-facts', facts => {

			const authorName = facts['author'].name

			authorStats[authorName] = authorStats[authorName]
				? authorStats[authorName].concat(facts)
				: [facts]

		})
		.on('end', ( ) => {

			var summary = { }

			const lineStats = {
				total_context:   0,
				total_additions: 0,
				total_deletions: 0
			}

			Object.keys(authorStats).forEach(authorName => {

				authorStats[authorName].forEach(facts => {

					facts.diffs.forEach(diff => {

						lineStats.total_context   += diff.lineStats.total_context
						lineStats.total_additions += diff.lineStats.total_additions
						lineStats.total_deletions += diff.lineStats.total_deletions

					})

				})

				summary[authorName] = {
					lineStats,
					totalCommits: authorStats[authorName].length
				}

			})

			console.log(JSON.stringify(summary))

		})

}





module.exports = displayStats
