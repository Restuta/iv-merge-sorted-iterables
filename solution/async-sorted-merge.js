'use strict'

var co = require('co')
const Rx = require('rxjs/Rx')
const mergeSortedSequences = require('../lib/merger/merge-sorted-sequences')

var fn = co.wrap(function* (val) {
  return yield Promise.resolve(val);
});


const promiseIterableToIterable =
//co.wrap(
  function* (promiseIterable) {
    console.info('inside promise iterable')

    for(let promise of promiseIterable) {
      console.info('iterating over pomises')
      console.info(promise)
      yield promise
    }
  }
//)


function* createIterableSource(logSource) {
  while(true) {
    yield logSource.popAsync()
  }
  // for(let i = 0; i < logSource.length; i += 1) {
  //   yield logSource[i].popAsync()
  // }
}


module.exports = (logSources, printer) => {

  // const iterableLogSource1 = createIterableSource(logSources[0])
  // const iterableLogSource2 = createIterableSource(logSources[0])


  const observable = Rx.Observable.create(observer => {
    mergeSortedSequences(
      logSources.map(x => createIterableSource(x)),
      (a, b) => new Date(a.date) < new Date(b.date),
      observer
    )
    .then(() => console.info('all done'))
  })

  observable.subscribe(
    logItem =>  printer.print(logItem),
    e => console.error(e),
    () => console.log('completed!')
  )

  // console.info(observable)

  // const iterable = promiseIterableToIterable(iterableLogSource)
  //   .then(x => console.info(x))

  // console.info(iterable.next())

  // for (let item of iterable) {
  //   console.info(item)
  // }

  // const merged = mergeSortedSequences(
  //   logSources.map(x => createIterableSource(x)),
  //   (a, b) => new Date(a.date) < new Date(b.date)
  // )
  //
  // for(let logItem of merged) {
  //   console.info(logItem)
  //   printer.print(logItem)
  // }

	// throw new Error('Not implemented yet!  That part is up to you!')
}
