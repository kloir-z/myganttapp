// utils/wbsHelpers.ts
import { v4 as uuidv4 } from 'uuid';
import { WBSData } from '../types/DataTypes';
import { parse, format } from 'date-fns';

export const assignIds = (data: WBSData[]): { [id: string]: WBSData } => {
  const dataWithIdsAndNos: { [id: string]: WBSData } = {};
  data.forEach((row, index) => {
    const id = uuidv4();
    dataWithIdsAndNos[id] = { ...row, id, no: index + 1 };
  });
  return dataWithIdsAndNos;
};

export const reorderArray = <T extends { id: string }>(arr: T[], indexesToMove: number[], newIndex: number): T[] => {
  const itemsToMove = indexesToMove.map(index => arr[index]);
  let remainingItems = arr.filter((_, index) => !indexesToMove.includes(index));

  if (newIndex > arr.length) newIndex = arr.length;
  else if (newIndex < 0) newIndex = 0;

  const start = remainingItems.slice(0, newIndex);
  const end = remainingItems.slice(newIndex);

  return [...start, ...itemsToMove, ...end];
};

export function standardizeShortDateFormat(dateStr: string) {
  const formats = [
    'yyyy/MM/dd', 'yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy',
    'yy/MM/dd', 'yy-MM-dd', 'M/d/yy', 'd/M/yy'
  ];

  for (let fmt of formats) {
    try {
      let parsedDate = parse(dateStr, fmt, new Date());
      if (fmt.includes('yy') && !fmt.includes('yyyy')) {
        parsedDate = adjustCenturyForTwoDigitYear(parsedDate);
      }
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'M/d');
      }
    } catch (e) {
      continue;
    }
  }
  return dateStr;
}

export function standardizeLongDateFormat(dateStr: string) {
  const formats = [
    'yyyy/MM/dd', 'yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy',
    'yy/MM/dd', 'yy-MM-dd', 'M/d/yy', 'd/M/yy'
  ];

  for (let fmt of formats) {
    try {
      let parsedDate = parse(dateStr, fmt, new Date());
      if (fmt.includes('yy') && !fmt.includes('yyyy')) {
        parsedDate = adjustCenturyForTwoDigitYear(parsedDate);
      }
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'yyyy-MM-dd');
      }
    } catch (e) {
      continue;
    }
  }
  return dateStr;
}

function adjustCenturyForTwoDigitYear(date: Date) {
  const currentYear = new Date().getFullYear();
  const twoDigitYear = date.getFullYear() % 100;
  const century = Math.floor(currentYear / 100) * 100;
  return new Date(date.setFullYear(century + twoDigitYear));
}