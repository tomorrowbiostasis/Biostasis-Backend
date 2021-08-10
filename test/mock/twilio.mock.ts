import * as uuid from 'uuid';

export const fetch = jest.fn(async () => ({}));

export const twilioMock = {
  messages: {
    create: jest.fn(async () => ({ sid: uuid.v4(), errorCode: null })),
  },
};
