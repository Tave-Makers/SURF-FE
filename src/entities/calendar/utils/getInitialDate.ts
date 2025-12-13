export const getInitialDate = (date?: Date): Date =>
  date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
