import chalk from 'chalk';
import _ from 'lodash';
import { Worker } from 'worker_threads';
import { runBatchWorkerThreads, runSingleThread, runUnitWorkerThreads } from './lib/ts/helpers/bench.helper';
import { WorkerHelper } from './lib/ts/helpers/worker.helper';

const WORKERS_SIZE: number = 8;
const SEQUENCE_SIZE: number = 1000000;

const UNIT_WORKER_PATH: string = `${__dirname}/lib/ts/workers/unit.worker.ts`;
const BATCH_WORKER_PATH: string = `${__dirname}/lib/ts/workers/batch.worker.ts`;

(async () => {
  const sequence: string[] = _.range(0, SEQUENCE_SIZE).map((value: number) => value.toString());
  const sequences: string[][] = _.chunk(sequence, Math.ceil(sequence.length / WORKERS_SIZE));

  let start: number = performance.now();
  let results: string[] = runSingleThread(sequence);
  let end: number = performance.now();
  let duration: string = Number((end - start) / 1000).toFixed(4);
  console.log(results.length, 'single threaded tasks done in', chalk.green(duration), 'seconds');

  let workers: Worker[] = _.range(0, WORKERS_SIZE).map(() => WorkerHelper.getTsWorker(UNIT_WORKER_PATH, {}));
  start = performance.now();
  results = await runUnitWorkerThreads(workers, sequence);
  end = performance.now();
  duration = Number((end - start) / 1000).toFixed(4);
  console.log(results.length, 'unit worker tasks done in', chalk.green(duration), 'seconds');
  await Promise.all(workers.map((worker: Worker) => worker.terminate()));

  workers = _.range(0, WORKERS_SIZE).map(() => WorkerHelper.getTsWorker(BATCH_WORKER_PATH, {}));
  start = performance.now();
  results = _.flatten(await runBatchWorkerThreads(workers, sequences));
  end = performance.now();
  duration = Number((end - start) / 1000).toFixed(4);
  console.log(results.length, 'batch worker tasks done in', chalk.green(duration), 'seconds');
  await Promise.all(workers.map((worker: Worker) => worker.terminate()));
})();
