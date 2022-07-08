export enum DAYS_OF_WEEKS {
  MONDAY = 2,
  TUESDAY = 3,
  WEDNESDAY = 4,
  THURSDAY = 5,
  FRIDAY = 6,
  SATURDAY = 7,
  SUNDAY = 1,
}

export const numberToDaysOfWeek = new Map([
  [2, 'Monday'],
  [3, 'Tuesday'],
  [4, 'Wednesday'],
  [5, 'Thursday'],
  [6, 'Friday'],
  [7, 'Saturday'],
  [1, 'Sunday'],
]);