'use strict'
var co = require('co')
const Rx = require('rxjs/Rx')
const mergeSortedSequencesAsync = require('../lib/merger/merge-sorted-sequences-async')

//creates infinite iterable of promises
function* createIterableFromAsyncLogSource(logSource) {
  while(true) {
    yield logSource.popAsync()
  }
}


module.exports = (logSources, printer) => {
  const iterableLogSources = logSources.map(x => createIterableFromAsyncLogSource(x))
  const comparator = (a, b) => new Date(a.date) < new Date(b.date)

  const observable = mergeSortedSequencesAsync(iterableLogSources, comparator)

  observable.subscribe(
    logItem =>  printer.print(logItem),
    e => console.error(e),
    () => printer.done()
  )
}
