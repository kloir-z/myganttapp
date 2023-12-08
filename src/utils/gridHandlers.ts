// gridHandlers.ts
import { CellChange, TextCell, NumberCell, CheckboxCell, EmailCell, DropdownCell, ChevronCell, HeaderCell, TimeCell, DateCell } from "@silevis/reactgrid";
import { WBSData, ChartRow, SeparatorRow } from '../types/DataTypes';
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

    if (rowData && rowData.rowType === 'Chart') {
      const fieldName = change.columnId as keyof ChartRow; 
      const newCell = change.newCell;

      if (newCell.type === 'customDate') {
        const customDateCell = newCell as CustomDateCell;
        updatedData[rowId] = {
          ...rowData,
          [fieldName]: customDateCell.text
        };
      } else if (fieldName === 'chainNo' && newCell.type === 'customText') {
        const newChainNoText = (newCell as CustomTextCell).text;

        if (newChainNoText) {
          // 新しいchainNoが空でない場合の処理
          const newChainNo = parseInt(newChainNoText);
      
          // chainNoに対応する行のIDを見つける
          const chainRowId = Object.keys(data).find(key => {
            const keyRowData = data[key];
            return keyRowData.rowType === 'Chart' && (keyRowData as ChartRow).no === newChainNo;
          });
          
          // 対応する行があれば、そのIDをchain列に設定
          if (chainRowId) {
            updatedData[rowId] = {
              ...rowData,
              chain: chainRowId,
              chainNo: newChainNo.toString()
            };
          }
        } else {
          // 新しいchainNoが空の場合の処理（chainとchainNoを空にする）
          updatedData[rowId] = {
            ...rowData,
            chain: '',
            chainNo: ''
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

    if (rowData && rowData.rowType === 'Separator') {
      const fieldName = change.columnId as keyof SeparatorRow;
      const newCell = change.newCell;
      useSimpleSetData = true;
      if (newCell.type === 'customText' && fieldName === 'displayName') {
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