import { Worker, WorkerOptions } from 'worker_threads';

export class WorkerHelper {
  public static getTsWorker(path: string, options?: WorkerOptions): Worker {
    if (options == null) {
      options = {};
    }
    if (options.workerData == null) {
      options.workerData = {};
    }
    options.eval = true;
    options.workerData.__filename = path;

    return new Worker(
      `
        const wk = require('worker_threads');
        require('ts-node').register();
        let file = wk.workerData.__filename;
        delete wk.workerData.__filename;
        require(file);
      `,
      options,
    );
  }
}
