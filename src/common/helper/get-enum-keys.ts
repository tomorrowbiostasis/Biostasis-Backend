export const getEnumKeys = (
  data: Record<string, string | number>,
  withLowerCase = false
): string[] => {
  return Object.keys(data)
    .map((value) => (withLowerCase ? value.toLowerCase() : value))
    .filter((value) => isNaN(parseInt(value)));
};
