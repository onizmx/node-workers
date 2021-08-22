const { createSha256Hash } = require('./compute.helper');

const runSingleThread = sequence => {
  return sequence.map(value => createSha256Hash(value));
};

const runUnitWorkerThreads = async (workers, sequence) => {
  return new Promise(resolve => {
    const results = [];

    for (const worker of workers) {
      worker.on('message', message => {
        results.push(message.output);
        if (results.length === sequence.length) {
          resolve(results);
        }
      });
    }

    sequence.forEach((value, index) => {
      const workerIndex = index % workers.length;
      const message = { input: value };
      workers[workerIndex].postMessage(message);
    });
  });
};

const runBatchWorkerThreads = async (workers, sequences) => {
  return new Promise(resolve => {
    const results = [];

    for (const worker of workers) {
      worker.on('message', message => {
        results.push(message.output);
        if (results.length === sequences.length) {
          resolve(results);
        }
      });
    }

    sequences.forEach((sequence, index) => {
      const workerIndex = index % workers.length;
      const message = { input: sequence };
      workers[workerIndex].postMessage(message);
    });
  });
};

module.exports = { runSingleThread, runUnitWorkerThreads, runBatchWorkerThreads };
