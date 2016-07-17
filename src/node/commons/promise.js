
"use strict"




const promise = { }





promise.all = promises => {

	var chain = new Promise( resolve => resolve([ ]) )

	promises.forEach(promise => {

		chain = chain
		.then(previous => {
			return promise.then(val => {
				return previous.concat(val)
			})
		})

	})

	return chain

}





module.exports = promise
