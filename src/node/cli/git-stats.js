
"use strict"





const path   = require('path')
const docopt = require('docopt')
const app    = require( path.resolve(path.join(__dirname, '../app/app.js')) )





const args = docopt.docopt(`
Usage:
	git-stats (--path=<str>) [--branch=<str>]

Options:
	--branch=<str>    The branch to use [default: master].
	--path=<str>      The path to load.
	--time-series
`)





app(args)
