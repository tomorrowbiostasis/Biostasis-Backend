import { UpdateUserProfileDTO } from '../../user/request/dto/update-user-profile.dto';

export const omit = (
  obj: Record<string, unknown> | UpdateUserProfileDTO,
  omittedKeys: string[]
): any =>
  Object.entries(obj)
    .filter(([key]) => !omittedKeys.includes(key))
    .reduce((newObj, [key, val]) => Object.assign(newObj, { [key]: val }), {});
