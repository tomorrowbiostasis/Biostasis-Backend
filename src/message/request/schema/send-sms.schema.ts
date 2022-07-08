import * as Joi from 'joi';
import { MESSAGE_TYPE } from '../../enum/message-type.enum';

export const sendSmsSchema: Joi.ObjectSchema = Joi.object({
  messageType: Joi.string()
    .valid(...Object.values(MESSAGE_TYPE))
    .required(),
});
