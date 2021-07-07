import * as AWS from 'aws-sdk';

export const cognitoIdentityServiceMock = {
  adminAddUserToGroup: jest.fn(async () => ({})),
  adminCreateUser: jest.fn(async () => ({})),
  listUsers: jest.fn(
    async (
      params: AWS.CognitoIdentityServiceProvider.Types.ListUsersRequest,
      callback: () => void,
    ) => ({}),
  ),
  adminDeleteUser: jest.fn(async () => ({})),
  adminSetUserPassword: jest.fn(async () => ({})),
};
