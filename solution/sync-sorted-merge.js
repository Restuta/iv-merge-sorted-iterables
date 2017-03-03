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
  const iterableLogSources = logSources.map(x => createIterableSource(x))
  const comparator = (a, b) => new Date(a.date) < new Date(b.date)

  const merged = mergeSortedSequences(iterableLogSources, comparator)

  for(let logItem of merged) {
    printer.print(logItem)
  }

  printer.done()
}
