// CalendarUtils.ts

// 2023年と2024年の祝日
const holidays = [
  "2023-01-01",
  "2023-01-02",
  "2023-01-09",
  "2023-02-11",
  "2023-02-23",
  "2023-03-21",
  "2023-04-29",
  "2023-05-03",
  "2023-05-04",
  "2023-05-05",
  "2023-07-17",
  "2023-08-11",
  "2023-09-18",
  "2023-09-23",
  "2023-10-09",
  "2023-11-03",
  "2023-11-23",
  "2024-01-01",
  "2024-01-08",
  "2024-02-11",
  "2024-02-12",
  "2024-02-23",
  "2024-03-20",
  "2024-04-29",
  "2024-05-03",
  "2024-05-04",
  "2024-05-05",
  "2024-05-06",
  "2024-07-15",
  "2024-08-11",
  "2024-08-12",
  "2024-09-16",
  "2024-09-22",
  "2024-09-23",
  "2024-10-14",
  "2024-11-03",
  "2024-11-04",
  "2024-11-23",
];

const holidayDates = holidays.map(holiday => {
  const [year, month, day] = holiday.split('-').map(Number);
  return new Date(year, month - 1, day);
});

export const isHoliday = (date: Date) => {
  return holidayDates.some(holiday =>
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
};

export const generateDates = (start: Date, end: Date) => {
  const dateArray: Date[] = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const adjustedDate = new Date(currentDate);
    adjustedDate.setHours(0, 0, 0, 0);
    dateArray.push(adjustedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const calculateBusinessDays = (start: Date, end: Date): number => {
  let count = 0;
  let currentDate = new Date(getStartOfDay(start));

  while (currentDate <= getStartOfDay(end)) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(currentDate)) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};

export const addBusinessDays = (start: Date, days: number, includeStartDay: boolean = true): Date => {
  let currentDate = new Date(start);
  let addedDays = 0;

  const startDayOfWeek = currentDate.getDay();

  if (includeStartDay) {
    if (startDayOfWeek !== 0 && startDayOfWeek !== 6 && !isHoliday(currentDate)) {
      addedDays = 1;
    }
  }

  while (addedDays < days) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(currentDate)) {
      addedDays++;
    }
  }

  return currentDate;
};

export const toLocalISOString = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split('T')[0];
};