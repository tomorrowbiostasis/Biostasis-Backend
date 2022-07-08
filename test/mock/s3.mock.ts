import * as faker from 'faker';

export const s3Mock = {
  upload: jest.fn((params, cb) =>
    cb(undefined, { Key: faker.datatype.uuid() })
  ),
  deleteObject: jest.fn((params, cb) => cb(undefined, {})),
  copyObject: jest.fn((params, cb) => cb(undefined, {})),
  getSignedUrl: jest.fn(async () => faker.image.imageUrl()),
  getObject: jest.fn((params, cb) =>
    cb(undefined, { Body: faker.datatype.string() })
  ),
};
