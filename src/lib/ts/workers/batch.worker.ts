import { BinaryLike } from 'crypto';
import { parentPort } from 'worker_threads';
import { createSha256Hashes } from '../helpers/compute.helper';

export type BatchInputMessage = {
  input: BinaryLike[];
};

export type BatchOutputMessage = {
  output: string[];
};

parentPort!.on('message', ({ input }: BatchInputMessage) => {
  const message: BatchOutputMessage = { output: createSha256Hashes(input) };
  parentPort!.postMessage(message);
});
