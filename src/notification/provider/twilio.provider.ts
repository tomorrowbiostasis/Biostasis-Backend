import * as twilio from 'twilio';
import * as config from 'config';

export const TwilioProvider = {
  provide: twilio.Twilio,
  useFactory: () =>
    twilio(config.get('twilio.accountSid'), config.get('twilio.authToken')),
};
