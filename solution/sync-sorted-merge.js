'use strict'

const mergeSortedSequences = require('../lib/merger/merge-sorted-sequences')

function* createIterableSource(logSource) {
  let nextLogItem = logSource.pop()

  while (nextLogItem !== false) {
    yield nextLogItem
    nextLogItem = logSource.pop()
  }
}


module.exports = (logSources, printer) => {
  const merged = mergeSortedSequences(
    logSources.map(x => createIterableSource(x)),
    (a, b) => new Date(a.date) < new Date(b.date)
  )

  for(let logItem of merged) {
    console.info(logItem)
    printer.print(logItem)
  }

	// throw new Error('Not implemented yet!  That part is up to you!')
}
