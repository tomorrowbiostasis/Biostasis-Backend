import * as LibPhoneNumber from 'google-libphonenumber';

export const checkPhoneNumber = (
  phoneUtil: LibPhoneNumber.PhoneNumberUtil,
  prefix: number,
  phone: string,
  country: string
): boolean => {
  const number = phoneUtil.parseAndKeepRawInput(`+${prefix}${phone}`, country);

  return phoneUtil.isValidNumber(number);
};
