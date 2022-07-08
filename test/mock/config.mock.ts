import configuration from '../../src/config/default';
import * as flat from 'flat';

export const configMock = {
  get: jest.fn((key: number | string) => {
    const data = flat(configuration());

    return data[key];
  }),
};
