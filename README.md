Merging Logs
============

See https://docs.google.com/document/d/1A6wH-Hifd2uAcaNBMDE4iUH4NBCs6u8vjnkbDWMU8h0/edit for instructions.

Approach

Ideally I wanted to use Observables as an abstraction to solve both problems, since observable represents "value over time" it fits great for async log source and sync log source is just a sub-set of async. Converting both log sources to observables is pretty trivial task, but then I figured that to solve this efficiently I'd need to write a custom operator "merge sorted observables". Spending few hours researching this I understood that it's not easy and requires advanced understanding of Observables and their internals. I was able to find an [implementation in Java](https://gist.github.com/akarnokd/c86a89738199bbb37348) that made it's way to RxJava, but as you can see that code is far from easy to understand.

That would be an ideal implementation, but far too complex for now.

So here I was looking for alternatives... 😅

Node Streams was my next obvious choice, but then I realized that I'd have to stick with that programming model and force consumers to use pipe(), while I still thought Observables could be more useful and feel arguable more natural (I am biased there). So next idea was to use generators and write a generic function that merges arbitrary sorted sequences. So I did that and then modified it to work for sequences of promises. Async version returns an Observable that represents "merged logs over time".

It turned out to be pretty elegant solution, the drawback is that there is code duplication. There is no easy way to refactor sync version and async one to re-use some code since control flow is different. (even though it looks similar thanks to library "co" + generators). Which is not a big deal and in production that likely to be only one version (async is my bet).

As a bonus I did performance test of few priority queues https://github.com/lemire/FastPriorityQueue.js/issues/5. Also normally I set up Babel to use ES Next goodness which I didn't do in this case since boilerplate is been provided.

Please start reading from index.js and follow along my comments for more detils.

I had a lot of fun!
