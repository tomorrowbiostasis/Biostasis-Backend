import * as twilio from 'twilio';
import { ConfigService } from '@nestjs/config';

export const TwilioProvider = {
  provide: twilio.Twilio,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    twilio(config.get('twilio.accountSid'), config.get('twilio.authToken')),
};
