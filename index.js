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
 * Challenge Number 1!
 *
 * Assume that a LogSource only has one method: pop() which will return a LogEntry.
 *
 * A LogEntry is simply an object of the form:
 * {
 * 		date: Date,
 * 		msg: String,
 * }
 *
 * All LogEntries from a given LogSource are guaranteed to be popped in chronological order.
 * Eventually a LogSource will end and return boolean false.
 *
 * Your job is simple: print the sorted merge of all LogEntries across `n` LogSources.
 *
 * Call `printer.print(logEntry)` to print each entry of the merged output as they are ready.
 * This function will ensure that what you print is in fact in chronological order.
 * Call 'printer.done()' at the end to get a few stats on your solution!
 */

const syncLogSources = []
for (let i = 0; i < sourceCount; i++) {
	syncLogSources.push(new LogSource())
}
require('./solution/sync-sorted-merge')(syncLogSources, new Printer())

/**
 * Challenge Number 2!
 *
 * Very similar to Challenge Number 1, except now you should assume that a LogSource
 * has only one method: popAsync() which returns a promise that resolves with a LogEntry,
 * or boolean false once the LogSource has ended.
 */

const asyncLogSources = []
for (let i = 0; i < sourceCount; i++) {
	asyncLogSources.push(new LogSource())
}

require('./solution/async-sorted-merge')(asyncLogSources, new Printer())
