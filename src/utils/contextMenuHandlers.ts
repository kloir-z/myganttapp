// utils/contextMenuHandlers.ts
import { WBSData, ChartRow, SeparatorRow } from '../types/DataTypes';
import { assignIds } from './wbsHelpers';
import { simpleSetData } from '../reduxComponents/store';
import { Id } from "@silevis/reactgrid";
import { Dispatch } from 'redux'; 

export const handleAddChartRow = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const newDataArray = dataArray.slice();
  const minIndex = Math.min(...selectedRowIds.map(id => 
    newDataArray.findIndex(item => item.id === id)));

  for (let i = 0; i < selectedRowIds.length; i++) {
    const newDataRow: ChartRow = {
      rowType: "Chart",
      no: 0,
      id: "",
      textColumn1: "",
      textColumn2: "",
      textColumn3: "",
      textColumn4: "",
      color: "",
      plannedStartDate: "",
      plannedEndDate: "",
      businessDays: 1,
      actualStartDate: "",
      actualEndDate: "",
      displayName: "",
      dependentId: "",
      dependency: "",
    };
    newDataArray.splice(minIndex + i, 0, newDataRow);
  }

  dispatch(simpleSetData(assignIds(newDataArray)));
};

export const handleAddSeparatorRow = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const newDataArray = dataArray.slice();
  const minIndex = Math.min(...selectedRowIds.map(id => 
    newDataArray.findIndex(item => item.id === id)));

  for (let i = 0; i < selectedRowIds.length; i++) {
    const newDataRow: SeparatorRow = {
      rowType: "Separator",
      no: 0,
      id: "",
      displayName: ""
    };
    newDataArray.splice(minIndex + i, 0, newDataRow);
  }

  dispatch(simpleSetData(assignIds(newDataArray)));
};


export const handleRemoveSelectedRow = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const newDataArray = dataArray.filter(item => 
    !selectedRowIds.includes(item.id));
  dispatch(simpleSetData(assignIds(newDataArray)));
};
