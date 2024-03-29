// utils/contextMenuHandlers.ts
import { WBSData, ChartRow, SeparatorRow, EventRow } from '../types/DataTypes';
import { assignIds } from './wbsHelpers';
import { simpleSetData } from '../reduxComponents/store';
import { Id } from "@silevis/reactgrid";
import { Dispatch } from 'redux';
import { setCopiedRows } from '../reduxComponents/copiedRowsSlice';

export const handleCopySelectedRow = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const copiedRows = dataArray.filter(item => selectedRowIds.includes(item.id)).map(item => {
    const copy = { ...item };
    copy.id = '';
    return copy;
  });
  dispatch(setCopiedRows(copiedRows));
};

export const handlePasteRows = (dispatch: Dispatch, targetRowId: Id, dataArray: WBSData[], copiedRows: WBSData[]) => {
  if (copiedRows.length === 0) {
    console.log("No rows to paste");
    return;
  }

  const targetIndex = dataArray.findIndex(row => row.id === targetRowId);
  if (targetIndex === -1) {
    console.log("Target row not found");
    return;
  }

  const newDataArray = dataArray.slice();
  newDataArray.splice(targetIndex, 0, ...copiedRows);
  dispatch(simpleSetData(assignIds(newDataArray)));
};

export const handleCutRows = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const copiedRows = dataArray.filter(item => selectedRowIds.includes(item.id)).map(item => {
    const copy = { ...item };
    copy.id = '';
    return copy;
  });
  dispatch(setCopiedRows(copiedRows));
  const newDataArray = dataArray.filter(item => 
    !selectedRowIds.includes(item.id));
  dispatch(simpleSetData(assignIds(newDataArray)));
};

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
      businessDays: null,
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

export const handleAddEventRow = (dispatch: Dispatch, selectedRowIds: Id[], dataArray: WBSData[]) => {
  const newDataArray = dataArray.slice();
  const minIndex = Math.min(...selectedRowIds.map(id => 
    newDataArray.findIndex(item => item.id === id)));

  for (let i = 0; i < selectedRowIds.length; i++) {
    const newDataRow: EventRow = {
      rowType: "Event",
      no: 0,
      id: "",
      textColumn1: "",
      textColumn2: "",
      textColumn3: "",
      textColumn4: "",
      color: "",
      displayName: "",
      eventData: []
    };
    newDataArray.splice(minIndex + i, 0, newDataRow);
  }

  dispatch(simpleSetData(assignIds(newDataArray)));
};
