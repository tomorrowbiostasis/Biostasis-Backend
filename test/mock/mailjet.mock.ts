export const request = jest.fn(async () => ({}));

export const mailJetMock = {
  post: () => ({ request }),
};
