import * as Joi from 'joi';
import { MESSAGE_TYPE } from '../../enum/message-type.enum';

export const sendEmergencyMessageSchema: Joi.ObjectSchema = Joi.object({
  locationUrl: Joi.string().allow(''),
  delayed: Joi.boolean(),
  messageType: Joi.string().valid(...Object.values(MESSAGE_TYPE)),
})
  .and('delayed', 'messageType')
  .options({
    presence: 'optional',
  });
