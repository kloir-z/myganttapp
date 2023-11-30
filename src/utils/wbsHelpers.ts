// utils/wbsHelpers.ts
import { v4 as uuidv4 } from 'uuid';
import { WBSData } from '../types/DataTypes';

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