var config = module.exports;

var devConfig = {
    rootPath: "../",
    environment: "browser", // or "node"
    sources: [
        "src/*.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};

config["InlineWorkerDist Tests"] = config["InlineWorkerDev Tests"] = devConfig;

config["InlineWorkerDist Tests"].sources = [
	"dist/inline-worker.min.js"
];
