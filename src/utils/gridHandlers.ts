// gridHandlers.ts
import { CellChange, TextCell, NumberCell, CheckboxCell, EmailCell, DropdownCell, ChevronCell, HeaderCell, TimeCell, DateCell } from "@silevis/reactgrid";
import { WBSData, ChartRow } from '../types/DataTypes';
import { Dispatch } from 'redux';
import { setData, simpleSetData } from '../reduxComponents/store';
import { CustomDateCell } from './CustomDateCell';
import { CustomTextCell } from "./CustomTextCell";

type AllCellTypes  = TextCell | NumberCell | CheckboxCell | EmailCell | DropdownCell | ChevronCell | HeaderCell | TimeCell | DateCell | CustomDateCell | CustomTextCell;  

export const handleGridChanges = (dispatch: Dispatch, data: { [id: string]: WBSData }, changes: CellChange<AllCellTypes>[]) => {
  const updatedData = { ...data };
  let useSimpleSetData = false;

  changes.forEach((change) => {
    const rowId = change.rowId.toString();
    const rowData = updatedData[rowId];

    if (rowData && rowData.rowType === 'Separator') {
      const newCell = change.newCell;
      useSimpleSetData = true;
      const customTextCell = newCell as CustomTextCell;
      updatedData[rowId] = {
        ...rowData,
        displayName: customTextCell.text
      };
    }

    if (rowData && rowData.rowType === 'Chart') {
      const fieldName = change.columnId as keyof ChartRow; 
      const newCell = change.newCell;
      useSimpleSetData = false;
      if (newCell.type === 'customDate') {
        const customDateCell = newCell as CustomDateCell;
        updatedData[rowId] = {
          ...rowData,
          [fieldName]: customDateCell.text
        };
      } else if (fieldName === 'chainNo' && newCell.type === 'customText') {
        const newChainNoText = (newCell as CustomTextCell).text;

        if (newChainNoText) {
          const newChainNo = parseInt(newChainNoText);
          const chainRowId = Object.keys(data).find(key => {
            const keyRowData = data[key];
            return keyRowData.rowType === 'Chart' && (keyRowData as ChartRow).no === newChainNo;
          });
          if (chainRowId) {
            updatedData[rowId] = {
              ...rowData,
              chain: chainRowId,
              chainNo: newChainNo
            };
          }
        } else {
          updatedData[rowId] = {
            ...rowData,
            chain: '',
            chainNo: null
          };
        }
      } else if (newCell.type === 'customText') {
        const customTextCell = newCell as CustomTextCell;
        updatedData[rowId] = {
          ...rowData,
          [fieldName]: customTextCell.text
        };
      }
    }
  });

  if (useSimpleSetData) {
    dispatch(simpleSetData(updatedData));
  } else {
    dispatch(setData(updatedData));
  }
};