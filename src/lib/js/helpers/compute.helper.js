const crypto = require('crypto');
const faker = require('faker');

const createSha256Hash = value => {
  const secret = faker.datatype.uuid();

  return crypto.createHmac('sha256', secret).update(value).digest('hex');
};

const createSha256Hashes = sequence => {
  return sequence.map(value => createSha256Hash(value));
};

module.exports = { createSha256Hash, createSha256Hashes };
