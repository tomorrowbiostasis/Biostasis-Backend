export const notificationServiceMock = {
  sendEmail: jest.fn(async () => ({})),
  sendSms: jest.fn(async () => ({})),
  sendEmergencyMessage: jest.fn(async () => ({})),
};
