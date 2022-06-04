export const getTimeFromDate = (date: string): string => {
    return date ? date.slice(11,16) : null;
};