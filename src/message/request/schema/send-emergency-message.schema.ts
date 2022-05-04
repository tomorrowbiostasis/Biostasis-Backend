import * as Joi from "joi";
import { MESSAGE_TYPE } from "../../enum/message-type.enum";

export const sendEmergencyMessageSchema: Joi.ObjectSchema = Joi.object({
  delayed: Joi.boolean(),
  messageType: Joi.string()
    .valid(...Object.values(MESSAGE_TYPE))
    .when("delayed", {
      is: Joi.exist().valid(true),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
}).options({
  presence: "optional",
});
