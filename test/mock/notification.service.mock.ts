export const notificationServiceMock = {
  prepareEmailData: jest.fn(() => ({})),
  prepareSmsData: jest.fn(() => ({})),
  sendEmergencyMessage: jest.fn(async () => ({})),
  sendSms: jest.fn(async () => ({})),
  sendEmail: jest.fn(async () => ({})),
};
