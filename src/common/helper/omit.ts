import { UpdateUserProfileDTO } from '../../user/request/dto/update-user-profile.dto';
import { UpdateContactAndCheckPhoneDTO } from '../../contact/request/dto/update-contact-and-check-phone.dto';
import { AddContactAndCheckPhoneDTO } from '../../contact/request/dto/add-contact-and-check-phone.dto';
import { AddTimeSlotDTO } from '../../trigger-time-slot/request/dto/add-time-slot.dto';
import { UserEntity } from '../../user/entity/user.entity';
import { ProfileEntity } from '../../user/entity/profile.entity';
import { ContactEntity } from '../../contact/entity/contact.entity';
import { TimeSlotEntity } from '../../trigger-time-slot/entity/time-slot.entity';
import { TimeSlotDayEntity } from '../../trigger-time-slot/entity/time-slot-day.entity';
import { UnconfirmedEmailEntity } from '../../user/entity/unconfirmed_email.entity';
import { FileEntity } from '../../file/entity/file.entity';

export const omit = (
  obj:
    | Record<string, unknown>
    | UpdateUserProfileDTO
    | UpdateContactAndCheckPhoneDTO
    | AddContactAndCheckPhoneDTO
    | AddTimeSlotDTO
    | UserEntity
    | ProfileEntity
    | ContactEntity
    | TimeSlotEntity
    | TimeSlotDayEntity
    | UnconfirmedEmailEntity
    | FileEntity,
  omittedKeys: string[]
): any =>
  Object.entries(obj)
    .filter(([key]) => !omittedKeys.includes(key))
    .reduce((newObj, [key, val]) => Object.assign(newObj, { [key]: val }), {});
