const chalk = require('chalk');
const _ = require('lodash');
const { Worker } = require('worker_threads');
const { runBatchWorkerThreads, runSingleThread, runUnitWorkerThreads } = require('./lib/js/helpers/bench.helper');

const WORKERS_SIZE = 8;
const SEQUENCE_SIZE = 1000000;

const UNIT_WORKER_PATH = `${__dirname}/lib/js/workers/unit.worker.js`;
const BATCH_WORKER_PATH = `${__dirname}/lib/js/workers/batch.worker.js`;

(async () => {
  const sequence = _.range(0, SEQUENCE_SIZE).map(value => value.toString());
  const sequences = _.chunk(sequence, Math.ceil(sequence.length / WORKERS_SIZE));

  let start = performance.now();
  let results = runSingleThread(sequence);
  let end = performance.now();
  let duration = Number((end - start) / 1000).toFixed(4);
  console.log(results.length, 'single threaded tasks done in', chalk.green(duration), 'seconds');

  let workers = _.range(0, WORKERS_SIZE).map(() => new Worker(UNIT_WORKER_PATH));
  start = performance.now();
  results = await runUnitWorkerThreads(workers, sequence);
  end = performance.now();
  duration = Number((end - start) / 1000).toFixed(4);
  console.log(results.length, 'unit worker tasks done in', chalk.green(duration), 'seconds');
  await Promise.all(workers.map(worker => worker.terminate()));

  workers = _.range(0, WORKERS_SIZE).map(() => new Worker(BATCH_WORKER_PATH));
  start = performance.now();
  results = _.flatten(await runBatchWorkerThreads(workers, sequences));
  end = performance.now();
  duration = Number((end - start) / 1000).toFixed(4);
  console.log(results.length, 'batch worker tasks done in', chalk.green(duration), 'seconds');
  await Promise.all(workers.map(worker => worker.terminate()));
})();
