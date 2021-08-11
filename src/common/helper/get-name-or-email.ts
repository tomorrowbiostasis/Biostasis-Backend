import { getFullName } from './get-full-name';

export const getNameOrEmail = (
  name: string,
  surname: string,
  email: string
): string => {
  const fullName = getFullName(name, surname);

  return fullName !== '' ? fullName : email;
};
