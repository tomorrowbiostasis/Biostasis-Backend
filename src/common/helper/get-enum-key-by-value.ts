export const getEnumKeyByValue = (
  data: Record<string, string | number>,
  phrase: string | number,
  withLowerCase = true
): string => {
  let keyFound: string;

  for (const [key, value] of Object.entries(data)) {
    if (value === phrase) {
      keyFound = key;
      break;
    }
  }

  return withLowerCase ? keyFound.toLocaleLowerCase() : keyFound;
};
