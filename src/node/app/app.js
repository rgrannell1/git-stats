
"use strict"



const path         = require('path')
const events       = require('events')
const git          = require('nodegit')

const facts        = require('../facts')
const displayStats = require('../app/display-stats')
const promise      = require('../commons/promise')





const app = args => {

	const factEmitter     = new events.EventEmitter( )
	const commitSummaries = [ ]

	const repoPath   = path.resolve(args['--path'])

	const branchName = 'master'
//	const branchName = 'develop'

	git.Repository
		.open(repoPath)
		.then(repo => {
			return repo.getBranchCommit(branchName).then(masterCommit => ({ repo, masterCommit }))
		})
		.then(repoData => {

			const repo         = repoData.repo
			const masterCommit = repoData.masterCommit

			const history = masterCommit.history(git.Revwalk.SORT.Time)

			history.on('end', commits => {

				const commitFacts = commits.map(facts.commit)
				const repoFacts   = facts.repository(commitFacts)

			})

			history.start( )

			masterCommit.getTree( ).then(tree => {

				const walker = tree.walk( )

				walker.on('end', entries => {

					const blameFacts = entries.map(entry => {

						return git.Blame.file(repo, entry.path( ))
							.then( facts.blame.bind({ }, entry.path( )) )
							.catch(err => {
								console.log(err)
							})

					})

					const blameData = promise.all(blameFacts)
					.then(f => {
						console.log(JSON.stringify(f))
					})

				})

				walker.start( )

			})

		})
		.catch(err => {
			console.error(err)
		})

}






module.exports = app

