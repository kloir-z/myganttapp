// utils/contextMenuHandlers.ts
import { WBSData, ChartRow, SeparatorRow } from '../types/DataTypes';
import { assignIds } from './wbsHelpers';
import { simpleSetData } from '../reduxComponents/store';
import { Id } from "@silevis/reactgrid";
import { Dispatch } from 'redux'; 

export const handleAddChartRowBelow = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const newDataArray = dataArray.slice();
  const maxIndex = Math.max(...selectedRowIds.map(id => 
    newDataArray.findIndex(item => item.id === id)));

  for (let i = 0; i < selectedRowIds.length; i++) {
    const newDataRow: ChartRow = {
      rowType: "Chart",
      no: 0,
      id: "",
      majorCategory: "",
      middleCategory: "",
      subCategory: "",
      task: "",
      color: "",
      plannedStartDate: "",
      plannedEndDate: "",
      businessDays: 1,
      actualStartDate: "",
      actualEndDate: "",
      comment: "",
      displayName: "",
      chain: "",
      chainNo: null,
    };
    newDataArray.splice(maxIndex + 1 + i, 0, newDataRow);
  }

  dispatch(simpleSetData(assignIds(newDataArray)));
};

export const handleAddSeparatorRowBelow = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const newDataArray = dataArray.slice();
  const maxIndex = Math.max(...selectedRowIds.map(id => 
    newDataArray.findIndex(item => item.id === id)));

  for (let i = 0; i < selectedRowIds.length; i++) {
    const newDataRow: SeparatorRow = {
      rowType: "Separator",
      no: 0,
      id: "",
      comment: "",
      displayName: ""
    };
    newDataArray.splice(maxIndex + 1 + i, 0, newDataRow);
  }

  dispatch(simpleSetData(assignIds(newDataArray)));
};


export const handleRemoveSelectedRow = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const newDataArray = dataArray.filter(item => 
    !selectedRowIds.includes(item.id));
  dispatch(simpleSetData(assignIds(newDataArray)));
};
