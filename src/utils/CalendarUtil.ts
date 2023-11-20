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