export const omit = (
  obj: Record<string, unknown>,
  omittedKeys: string[]
): Record<string, unknown> =>
  Object.entries(obj)
    .filter(([key]) => !omittedKeys.includes(key))
    .reduce((newObj, [key, val]) => Object.assign(newObj, { [key]: val }), {});
