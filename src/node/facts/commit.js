
"use strict"





const commit = commitData => {

	const diffPromise = new Promise((resolve, reject) => {

		return commitData.getDiff( )
		.then(diffs => {
			return diffs.map(diff => {

				return diff.patches( ).then(patches => {

					const diffStats = {
						total_context:   0,
						total_additions: 0,
						total_deletions: 0
					}

					patches.forEach(patch => {

						const patchStats = patch.lineStats( )

						diffStats.total_context   += patchStats.total_context
						diffStats.total_additions += patchStats.total_additions
						diffStats.total_deletions += patchStats.total_deletions

					})

					return diffStats

				})

			})
		})
		.catch(reject)

	})

	diffPromise.then(x => {

		console.log(x)

	}, err => console.log(err))

	return ['author', 'committer'].reduce((acc, methodName) => {

		return Object.assign(acc, {
			[methodName]: {
				email: commitData[methodName]( ).email( ),
				name:  commitData[methodName]( ).name( ),
				when:  {
					offset: commitData[methodName]( ).when( ).offset( ),
					time:   commitData[methodName]( ).when( ).time( )
				}
			}
		})

	}, {
		id:      commitData.id( ).toString( ),
		message: commitData.messageRaw( ),
		timeMs:  commitData.timeMs( ),
		diffs:   diffPromise
	})

}





module.exports = commit
