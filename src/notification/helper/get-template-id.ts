import { LANGUAGE } from '../constant/lanugage.constant';
import { EN_MAIL_TEMPLATE } from '../constant/template.constant';

const MailTemplatesConstants: object = {};
MailTemplatesConstants[LANGUAGE.ENGLISH] = EN_MAIL_TEMPLATE;

export const getMailTemplateId = (code: string): number => {
  return MailTemplatesConstants[LANGUAGE.ENGLISH][code];
};
