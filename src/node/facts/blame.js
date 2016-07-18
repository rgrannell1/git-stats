
"use strict"




const blame = (path, blameData) => {

	const stats = {
		hunks:   [ ],
		authors: { }
	}

	const hunkCount = blameData.getHunkCount( )

	if (hunkCount === 0) {
		return null
	}


	for (let ith = 0; ith < hunkCount; ++ith) {

		var hunk = blameData.getHunkByIndex(ith)

		const timestamp       = hunk.origSignature( ).when( ).time( )
		const parsedTimestamp = new Date(1000 * timestamp)

		var hunkData = {
			path,
			lines:     hunk.linesInHunk( ),
			author:    hunk.origSignature( ).name( ),
			timestamp,
			timeParts: [
				parsedTimestamp.getFullYear( ),
				parsedTimestamp.getMonth( ),
				parsedTimestamp.getDay( )
			]
		}

		stats.hunks.push(hunkData)

		if (!stats.authors.hasOwnProperty(hunkData.author)) {

			stats.authors[hunkData.author] = {
				path,
				count: hunkData.lines
			}

		} else {

			stats.authors[hunkData.author].count += hunkData.lines

		}

	}

	return stats

}





module.exports = blame
