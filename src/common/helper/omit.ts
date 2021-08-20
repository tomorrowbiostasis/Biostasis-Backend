import { UpdateUserProfileDTO } from '../../user/request/dto/update-user-profile.dto';
import { UpdateContactAndCheckPhoneDTO } from '../../contact/request/dto/update-contact-and-check-phone.dto';
import { AddContactAndCheckPhoneDTO } from '../../contact/request/dto/add-contact-and-check-phone.dto';
import { AddTimeSlotDTO } from '../../trigger-time-slot/request/dto/add-time-slot.dto';

export const omit = (
  obj:
    | Record<string, unknown>
    | UpdateUserProfileDTO
    | UpdateContactAndCheckPhoneDTO
    | AddContactAndCheckPhoneDTO
    | AddTimeSlotDTO,
  omittedKeys: string[]
): any =>
  Object.entries(obj)
    .filter(([key]) => !omittedKeys.includes(key))
    .reduce((newObj, [key, val]) => Object.assign(newObj, { [key]: val }), {});
