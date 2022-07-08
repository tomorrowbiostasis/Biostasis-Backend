export const getFullName = (name: string, surname: string): string =>
  `${name || ''} ${surname || ''}`.trim();