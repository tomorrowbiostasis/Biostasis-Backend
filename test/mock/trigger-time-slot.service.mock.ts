export const triggerTimeSlotServiceMock = {
  isActiveTimeSlot: jest.fn(async () => true),
  getActiveTimeSlot: jest.fn(async () => null),
};
