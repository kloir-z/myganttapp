import { CellChange, TextCell } from "@silevis/reactgrid";
import { WBSData } from '../types/DataTypes';
import { Dispatch } from 'redux';
import { setData } from '../reduxComponents/store';

export const handleGridChanges = (dispatch: Dispatch, data: { [id: string]: WBSData }, changes: CellChange[]) => {
  const updatedData = { ...data };

  changes.forEach((change) => {
    const rowId = change.rowId.toString();
    const fieldName = change.columnId as keyof WBSData;
  
    if (updatedData[rowId] && fieldName in updatedData[rowId]) {
      const newCell = change.newCell;

      if (newCell.type === 'text') {
        updatedData[rowId] = {
          ...updatedData[rowId],
          [fieldName]: (newCell as TextCell).text,
        };
      } else if (newCell.type === 'date') {
        const dateValue = (newCell as any).date;
        updatedData[rowId] = {
          ...updatedData[rowId],
          [fieldName]: dateValue instanceof Date ? dateValue.toISOString() : dateValue,
        };
      }
      // 他のセルタイプに対する処理も必要に応じて追加
    }
  });

  dispatch(setData(updatedData));
};
