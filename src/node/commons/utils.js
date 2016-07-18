
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

utils.average = (fn, coll) => {

	const sum = coll.reduce((acc, elem) => acc + fn(elem), 0)

	return sum / coll.length

}

utils.minBy = (fn, coll) => {

	return coll.reduce((min, current) => {
		return fn(current) < fn(min) ? current : min
	})

}

utils.maxBy = (fn, coll) => {

	return coll.reduce((max, current) => {
		return fn(current) > fn(max) ? current : max
	})

}




utils.tabulate = (fn, coll) => {

	const table = [ ]

	coll.forEach(elem => {

		const key = fn(elem)

		var hasMatch = false

		table.forEach(tableElem => {

			if (tableElem.key === key) {
				tableElem.count++
				hasMatch = true
			}

		})

		if (!hasMatch) {
			table.push({key, count: 1 })
		}

	})

	return table.sort((elem0, elem1) => {
		return elem0.count - elem1.count
	})

}






module.exports = utils
