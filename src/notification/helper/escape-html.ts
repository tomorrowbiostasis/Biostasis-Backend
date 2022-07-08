export const escapeHTML = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
