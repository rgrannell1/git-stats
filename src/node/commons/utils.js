
"use strict"




const utils = { }




utils.groupBy = (fn, coll) => {

	const groups = [ ]

	coll.forEach(elem => {

		const key    = fn(elem)
		var hasMatch = false

		groups.forEach(group => {

			if (group.key === key) {

				group.elems.push(elem)
				hasMatch = true

			}

		})

		if (!hasMatch) {
			groups.push({
				key,
				elems: [elem]
			})
		}

	})

	return groups

}





module.exports = utils
