/* global InlineWorker */

buster.spec.expose(); // Make some functions global

function cube(n) {
	return n * n;
}

describe("Inline Worker", function () {
	before(function () {
		this.timeout = 5*1000;
	});

	it("basic inline worker", function (done) {
		var worker = new InlineWorker(cube);
		worker.then(function (val) {
			expect(val).toEqual(25);
			done();
		}).run(5);
	});

	it("simple inline worker with long calculation", function (done) {
		function isPrime(num) {
			for (var i = 2, len = num / 2 + 1; i < len; i++) {
				if (num % i === 0) {
					return false;
				}
			}
			return true;
		}

		var worker = new InlineWorker(isPrime);
		worker.then(function (result) {
			expect(result).toBeTruthy();
			done();
		}).run(479001599); // 479001599 - ~2s
	});

	it("order of run and then should not be important", function (done) {
		var worker = new InlineWorker(cube).run(5);

		setTimeout(function () {
			worker.then(done(function (val) {
				expect(val).toEqual(25);
			}));
		}, 500);
	});

	it("multiple calls to worker", function (done) {
		var results = [16, 25, 36];

		new InlineWorker(cube)
			.then(function (val) {
				expect(val).toEqual(results.shift());
				if (results.length === 0) {
					done();
				}
			})
			.run(4)
			.run(5)
			.run(6);
	});

	it("worker with injected functions", function (done) {
		function sqrt(num) {
			return Math.sqrt(num);
		}

		new InlineWorker(function (num) {
			return sqrt(cube(num));
		}).inject(cube, sqrt).then(function (val) {
			expect(val).toEqual(5);
			done();
		}).run(5);
	});
});