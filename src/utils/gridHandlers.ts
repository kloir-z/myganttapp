// gridHandlers.ts
import { CellChange, TextCell, NumberCell, CheckboxCell, EmailCell, DropdownCell, ChevronCell, HeaderCell, TimeCell, DateCell } from "@silevis/reactgrid";
import { WBSData } from '../types/DataTypes';
import { Dispatch } from 'redux';
import { setData } from '../reduxComponents/store';
import { CustomDateCell } from './CustomDateCell';
import { CustomTextCell } from "./CustomTextCell";

type AllCellTypes  = TextCell | NumberCell | CheckboxCell | EmailCell | DropdownCell | ChevronCell | HeaderCell | TimeCell | DateCell | CustomDateCell | CustomTextCell;  

export const handleGridChanges = (dispatch: Dispatch, data: { [id: string]: WBSData }, changes: CellChange<AllCellTypes>[]) => {
  const updatedData = { ...data };

  changes.forEach((change) => {
    const rowId = change.rowId.toString();
    const fieldName = change.columnId as keyof WBSData;
    const rowData = updatedData[rowId];

    if (rowData) {
      const newCell = change.newCell;

      if (newCell.type === 'customDate') {
        const customDateCell = newCell as CustomDateCell;
        updatedData[rowId] = {
          ...rowData,
          [fieldName]: customDateCell.text
        };
      } else if (newCell.type === 'customText') {
        const customTextCell = newCell as CustomTextCell;
        updatedData[rowId] = {
          ...rowData,
          [fieldName]: customTextCell.text
        };
      } else if (rowData.rowType === 'Separator' && newCell.type === 'text') {
        updatedData[rowId] = {
          ...rowData,
          displayName: (newCell as TextCell).text
        };
      } else if (newCell.type === 'text') {
        updatedData[rowId] = {
          ...rowData,
          [fieldName]: (newCell as TextCell).text,
        };
      }
    }
  });

  dispatch(setData(updatedData));
};