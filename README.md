# Inline Worker

**Inline Worker** is a small JavaScript library that helps run inline functions in [Web Workers](http://www.w3.org/TR/workers/).

Web Workers allow you to run long-running scripts without blocking UI and other scripts because they run in a different thread. However, this requires that the code will be contained in a separate file. Thanks to other newly defined native HTML5 objects like [Blob](https://developer.mozilla.org/en/docs/DOM/Blob) and [URL](https://developer.mozilla.org/en-US/docs/DOM/window.URL) it is possible to run inline functions in Web Workers.

Haven't heard about Web Workers yet? Check out some tutorials on [MDN](https://developer.mozilla.org/en-US/docs/DOM/Using_web_workers?redirectlocale=en-US&redirectslug=Using_web_workers) and [HTML5 Rocks](http://www.html5rocks.com/en/tutorials/workers/basics/).

## Examples

More examples can be found in the test directory.

### Simple inline worker

```
// Define worker with inline function
var inlineWorker = new InlineWorker(function (num) {
	return num * num;
});

// Do something with the result
inlineWorker.then(function (value) {
	console.log(value); // => 25
});

// Start worker
inlineWorker.run(5);

// Each method is chainable. You can run it in this way:
inlineWorker
	.then(function (value) { console.log(value); })
	.run(5);
```

### Injecting functions

```
function cube(n) {
	return n * n;
}

function sqrt(num) {
	return Math.sqrt(num);
}

const NUM = 5;

// Define worker
var inlineWorker = new InlineWorker(function (num) {
	return sqrt(cube(num));
})

// Remember to inject functions used in a callback passed to the InlineWorker constructor.
// In other case they will not be found because the callback is serialized
// when passing to the worker. Moreover, these functions must be named functions.
inlineWorker.inject(cube, sqrt);

// Do something with the result
inlineWorker.then(function (val) {
	console.log(val); // => NUM
});

// Start worker
inlineWorker.run(NUM);
```

## API

#### Constructor

##### `InlineWorker(callback(arg: any): function)`

Constructor which creates an inline worker instance using provided callback. It's lazy i.e. Web Worker is created later when necessary.

* `callback(arg: any)` - `arg` is an argument passed to the worker when calling `run` method.

#### Methods

##### then `([success(value: any): function], [error(value: ErrorEvent): function])`

Using `then` method, success and error callbacks can be passed to the Web Worker. Both are optional.

* `success(value: any)` is called each time the worker posts message. `value` is a data property of `event` object.
* `error(value: ErrorEvent)` is called if any error occures inside the worker.

##### run `(data: any, [transfer: Array<Transferable>])`

Passes data to the worker. Arguments are passed as they are to the native `postMessage` method.

* `data` can be any data (primitive values, structured data) except DOM objects and other objects that cannot be cloned.
* `transfer` is an optional argument which can be used to send `ArrayBuffer` objects efficiently i.e. transfering them rather than cloning them.

##### inject `(...fns: function | fns: Array<function>)`

This method injects functions to the worker.

* `fns` can be a variable length list of function references or an array of function references.

## TODO

* it should be possible to pass callback and required functions in this way `new InlineWorker([sqrt, cube], function () {...})`,
* implement `addEventListener` (alias `on`) method to handle multiple listeners on success and error
* implement MapReduce algorithm.

## Similar projects

* [parallel.js](https://github.com/adambom/parallel.js) is a similar library which makes parallel computing in JavaScript easier.

## License

MIT