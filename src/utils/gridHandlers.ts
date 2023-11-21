// gridHandlers.ts
import { CellChange, TextCell } from "@silevis/reactgrid";
import { WBSData } from '../types/DataTypes';
import { Dispatch } from 'redux';
import { setData } from '../reduxComponents/store';

export const handleGridChanges = (dispatch: Dispatch, data: { [id: string]: WBSData }, changes: CellChange[]) => {
  const updatedData = { ...data };

  changes.forEach((change) => {
    const rowId = change.rowId.toString();
    const fieldName = change.columnId as keyof WBSData;
    const rowData = updatedData[rowId];

    if (rowData) {
      const newCell = change.newCell;

      if (rowData.rowType === 'Separator') {
        if (newCell.type === 'text') {
          updatedData[rowId] = {
            ...rowData,
            displayName: (newCell as TextCell).text
          };
        }
      } else if (newCell.type === 'text') {
        updatedData[rowId] = {
          ...rowData,
          [fieldName]: (newCell as TextCell).text,
        };
      } else if (newCell.type === 'date') {
        const dateValue = (newCell as any).date;
        updatedData[rowId] = {
          ...rowData,
          [fieldName]: dateValue instanceof Date ? dateValue.toISOString() : dateValue,
        };
      }
      // 他のセルタイプに対する処理も必要に応じて追加
    }
  });

  dispatch(setData(updatedData));
};
