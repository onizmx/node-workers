import { BinaryLike } from 'crypto';
import { parentPort } from 'worker_threads';
import { createSha256Hash } from '../helpers/compute.helper';

export type UnitInputMessage = {
  input: BinaryLike;
};

export type UnitOutputMessage = {
  output: string;
};

parentPort!.on('message', ({ input }: UnitInputMessage) => {
  const message: UnitOutputMessage = { output: createSha256Hash(input) };
  parentPort!.postMessage(message);
});
