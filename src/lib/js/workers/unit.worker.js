const { parentPort } = require('worker_threads');
const { createSha256Hash } = require('../helpers/compute.helper');

parentPort.on('message', ({ input }) => {
  const message = { output: createSha256Hash(input) };
  parentPort.postMessage(message);
});
