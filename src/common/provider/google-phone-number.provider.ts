import * as LibPhoneNumber from 'google-libphonenumber';
import { DICTIONARY } from '../constant/dictionary.constant';

export const GoogleLibPhoneNumberProvider = {
  provide: DICTIONARY.GOOGLE_PHONE_NUMBER,
  useFactory: () => {
    return LibPhoneNumber.PhoneNumberUtil.getInstance();
  },
};
