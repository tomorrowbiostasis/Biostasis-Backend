export const connectionMock = {
  createQueryRunner: jest.fn(() => ({
    startTransaction: jest.fn(async () => ({})),
    commitTransaction: jest.fn(async () => ({})),
    rollbackTransaction: jest.fn(async () => ({})),
    release: jest.fn(async () => ({})),
  })),
};
