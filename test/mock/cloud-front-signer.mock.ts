import * as faker from 'faker';

export const cloudFrontSignerMock = {
  getSignedUrl: jest.fn(() => faker.image.imageUrl()),
};
