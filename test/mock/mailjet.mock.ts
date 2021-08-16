export const request = jest.fn(async () => ({
  body: {
    Messages: [
      {
        Status: 'success',
      },
    ],
  },
}));

export const mailJetMock = {
  post: () => ({ request }),
};
