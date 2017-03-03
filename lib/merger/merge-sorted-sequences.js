'use strict'

// according to my benchmark this is the fastest priority queue implementation in JS as of Feb 2017
// more details https://github.com/andrasq/node-qheap/blob/master/Readme.md#performance
// import PriorityQueue from 'qheap'

const PriorityQueue  = require('qheap')

// merges N number of sorted iterable sequences (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator)
// in other words built-in iterables or things you'd typically create with generators
// uses binary heap based priority queue to achive O(k*log(n)) complexity
// where k is total number of sequences (n is the number of all elements)

// comparator is a function that is used for preserving the order, assuming that if applied to iterables to be merged
// the function would preserve order of iterable elements

// returns another iterable
function* mergeSortedSequences(sequences, comparator) {
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
    const item = sequences[i].next()

    if (!item.done) {
      enqueue(item.value, sequences[i])
    }
  }

  while (!queueIsEmpty()) {
    const currentItem = dequeue()
    yield currentItem.value

    const nextItem = currentItem.sequence.next()

    if (!nextItem.done) {
      enqueue(nextItem.value, currentItem.sequence)
    }
  }
}

module.exports = mergeSortedSequences
