export const userServiceMock = {
  findByIdOrFail: jest.fn(async () => ({})),
  updateUserDeviceId: jest.fn(),
  clearPositiveInfo: jest.fn()
};
