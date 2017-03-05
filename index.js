'use strict'

const LogSource = require('./lib/log-source')
const Printer = require('./lib/printer')

// You can adjust this variable to see how your solutions perform under various "load"

// by Anton: on my MBP 2011 2.3Ghz it merges:
// 1000 sources (~240K log records) in ~4.2s
// 1000 sources (~2.4M log records) in ~62.49s
// All times are without printing on the screen, so just pure CPU time.
// the complexity is  O(k*log(n))  where k is total number of sources, which is as fast as it generators
// Practically implementation can be speed up by few times with introducting optimizations to the implementation
// of the priority queue to the one that "knows" that it works with sorted entries and re-balances underlying heap
// more efficeintly
const sourceCount = 3

/**
 Merging synchronous log sources
 */

const syncLogSources = []
for (let i = 0; i < sourceCount; i++) {
	syncLogSources.push(new LogSource())
}
require('./solution/sync-sorted-merge')(syncLogSources, new Printer())

/**
 Merging async log sources 
 */

const asyncLogSources = []
for (let i = 0; i < sourceCount; i++) {
	asyncLogSources.push(new LogSource())
}

require('./solution/async-sorted-merge')(asyncLogSources, new Printer())
