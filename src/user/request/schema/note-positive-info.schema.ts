import * as Joi from "joi";

export const notePositiveInfoSchema: Joi.ObjectSchema = Joi.object({
  minutesToNext: Joi.number().min(6).max(2880),
}).options({
  presence: "optional",
});
