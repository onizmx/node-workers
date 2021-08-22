import crypto, { BinaryLike } from 'crypto';
import faker from 'faker';

const createSha256Hash = (value: BinaryLike): string => {
  const secret: string = faker.datatype.uuid();

  return crypto.createHmac('sha256', secret).update(value).digest('hex');
};

const createSha256Hashes = (sequence: BinaryLike[]): string[] => {
  return sequence.map((value: BinaryLike) => createSha256Hash(value));
};

export { createSha256Hash, createSha256Hashes };
