
"use strict"





const path   = require('path')
const neodoc = require('neodoc')
const app    = require( path.resolve(path.join(__dirname, '../app/app.js')) )





const args = neodoc.run(`
usage:
	git-stats [options]

options:
	--author=<str>   .
	--path=<str>     The path to load.
	--time-series
`)





app(args)
