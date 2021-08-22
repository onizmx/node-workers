import { Worker } from 'worker_threads';
import { BatchInputMessage, BatchOutputMessage } from '../workers/batch.worker';
import { UnitInputMessage, UnitOutputMessage } from '../workers/unit.worker';
import { createSha256Hash } from './compute.helper';

const runSingleThread = (sequence: string[]): string[] => {
  return sequence.map((value: string) => createSha256Hash(value));
};

const runUnitWorkerThreads = async (workers: Worker[], sequence: string[]): Promise<string[]> => {
  return new Promise(resolve => {
    const results: string[] = [];

    for (const worker of workers) {
      worker.on('message', (message: UnitOutputMessage) => {
        results.push(message.output);
        if (results.length === sequence.length) {
          resolve(results);
        }
      });
    }

    sequence.forEach((value: string, index: number) => {
      const workerIndex: number = index % workers.length;
      const message: UnitInputMessage = { input: value };
      workers[workerIndex]!.postMessage(message);
    });
  });
};

const runBatchWorkerThreads = async (workers: Worker[], sequences: string[][]): Promise<string[][]> => {
  return new Promise(resolve => {
    const results: string[][] = [];

    for (const worker of workers) {
      worker.on('message', (message: BatchOutputMessage) => {
        results.push(message.output);
        if (results.length === sequences.length) {
          resolve(results);
        }
      });
    }

    sequences.forEach((sequence: string[], index: number) => {
      const workerIndex: number = index % workers.length;
      const message: BatchInputMessage = { input: sequence };
      workers[workerIndex]!.postMessage(message);
    });
  });
};

export { runSingleThread, runUnitWorkerThreads, runBatchWorkerThreads };
