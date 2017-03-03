'use strict'

const PriorityQueue  = require('qheap')
var co = require('co')
const Rx = require('rxjs/Rx')

// This is an async version of merge-sorted-sequences.js, it's less generic and assumes that some iterables can
// be infinite, so it relies on the value to exist vs relying on just iterable state ("done" prop)
// uses "co" to make async code more readable

// returns a promise and also notifies observer about every new merged log entry
const mergeSortedSequences = co.wrap(function* (sequences, comparator, observer) {
  const defaultComparator = (a, b) => (a.value < b.value)
  // each queue item is of a shape {value, sequence}, therefore wrapping comparator accordingly
  const comparatorFunc = comparator
    ? (a, b) => comparator(a.value, b.value)
    : defaultComparator

  // abstracting away implementation of the queue, simplifies debugging of queue operations
  // improves readability and simplifies refactoring to extract queue implementation in future
  const priorityQueue = new PriorityQueue({ comparBefore: comparatorFunc })
  const enqueue = (value, sequence) => priorityQueue.insert({value, sequence})
  const dequeue = priorityQueue.remove.bind(priorityQueue)
  const queueIsEmpty = () => priorityQueue.length <= 0

  //add first element of every sequence to the queue
  for (let i = 0; i < sequences.length; i += 1) {
    const item = yield sequences[i].next()

    if (!item.done) {
      enqueue(item.value, sequences[i])
    }
  }

  while (!queueIsEmpty()) {
    const currentItem = dequeue()

    if (currentItem.value) {
      observer.next(currentItem.value)
    }
    
    const nextItem = yield currentItem.sequence.next()

    if (!nextItem.done && nextItem.value) {
      enqueue(nextItem.value, currentItem.sequence)
    }
  }

  observer.complete()
})

// wraps above function in an Observable so we can expose it to consumers since above returns a Promise
// and Promise is just an Observable that returns one value and we heed multiple-values
// Observable fits really nicely here.
const mergeSortedSequencesAsync = (sequences, comparator) =>
  Rx.Observable.create(observer => mergeSortedSequences(sequences, comparator, observer))

module.exports = mergeSortedSequencesAsync
