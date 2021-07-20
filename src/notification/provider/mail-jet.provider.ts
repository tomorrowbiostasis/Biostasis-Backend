import { DICTIONARY } from '../constant/dictionary.constant';
import { connect } from 'node-mailjet';
import * as config from 'config';

export const MailJetProvider = {
  provide: DICTIONARY.MAIL_JET,
  useFactory: () =>
    connect(config.get('mailJet.apiKey'), config.get('mailJet.apiSecret')),
};
