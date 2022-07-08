import { DICTIONARY } from '../constant/dictionary.constant';
import { connect } from 'node-mailjet';
import { ConfigService } from '@nestjs/config';

export const MailJetProvider = {
  provide: DICTIONARY.MAIL_JET,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    connect(config.get('mailJet.apiKey'), config.get('mailJet.apiSecret')),
};
