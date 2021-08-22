const { parentPort } = require('worker_threads');
const { createSha256Hashes } = require('../helpers/compute.helper');

parentPort.on('message', ({ input }) => {
  const message = { output: createSha256Hashes(input) };
  parentPort.postMessage(message);
});
