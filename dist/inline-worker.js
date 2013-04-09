;(function (__global__) {
	'use strict';

	function isWorkerSupported() {
		return !!__global__.Worker;
	}

	function InlineWorker(fn/*, options*/) {
		if (!isWorkerSupported()) {
			throw new Error('Web Worker is not supported');
		}

		if (!(this instanceof InlineWorker)) {
			return new InlineWorker(fn/*, options*/);
		}

		// @TODO: Any options are needed? Doubt it.
		//this.options = options || {};

		this.fnBody = 'self.onmessage = function (event) { self.postMessage((' + fn.toString() + ').call(self, event.data)) };';
		this.worker = this.resolve = this.reject = this.onmessage = this.onerror = null;
		this.injected = [];
	}

	InlineWorker.prototype = {
		constructor: InlineWorker,

		_assertWorker: function assertWorker() {
			var blob;
			if (this.worker) {
				return;
			}

			blob = new Blob([this.fnBody].concat(this.injected), { type: "application\/javascript" });
			this.worker = new Worker(__global__.URL.createObjectURL(blob));
		},

		run: function run(message, transferList) {
			this._assertWorker();
			this.worker.postMessage(message, transferList || null);
			this.worker.onmessage = this._onMessage.bind(this);
			this.worker.onerror = this._onError.bind(this);
			return this;
		},

		_onMessage: function onMessage(e) {
			this.resolve = e.data;
			// then() has already been called
			if (this.onmessage) {
				this.onmessage(e.data);
			}
		},

		_onError: function onError(e) {
			this.reject = e;
			// then() has already been called
			if (this.onerror) {
				this.onerror(e.message, e.filename, e.lineno, e);
			}
		},

		then: function then(success, error) {
			var err;
			this._assertWorker();

			if (typeof success === 'function') {
				this.onmessage = success;
				// Worker finished execution
				if (this.resolve) {
					this.onmessage(this.resolve);
				}
			}
			if (typeof error === 'function') {
				this.onerror = error;
				// Worker finished execution
				if (this.reject) {
					err = this.reject;
					this.onerror(err.message, err.filename, err.lineno, err);
				}
			}
			return this;
		},

		inject: function inject() {
			var argv = Array.prototype.slice.call(arguments),
				argc = argv.length,
				i = 0,
				fn;

			for (; i < argc; i++) {
				fn = argv[i];
				if (typeof fn === 'function') {
					// @TODO: check if function is named
					this.injected.push(fn.toString());
				}
			}

			return this;
		}
	};

	__global__.InlineWorker = InlineWorker;
}(window));