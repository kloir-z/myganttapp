import React, { useState, memo, useCallback } from 'react';
import { WBSData, ChartRow, SeparatorRow, EventRow  } from '../types/DataTypes';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setData} from '../reduxComponents/store';
import { ReactGrid, Column, Row, DefaultCellTypes, CellChange, HeaderCell, TextCell, DateCell, NumberCell, Id, MenuOption, SelectionMode } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const WBSInfo: React.FC = memo(({}) => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.wbsData);

  const formatDate = useCallback((dateStr: string) => {
    const date = dayjs(dateStr);
    return date.isValid() ? date.format('MM/DD') : null;
  },[]);
  
  const [columns, setColumns] = useState<Column[]>([
    { columnId: "No", width: 15, resizable: false },
    { columnId: "majorCategory", width: 50, resizable: true },
    { columnId: "middleCategory", width: 50, resizable: true },
    { columnId: "subCategory", width: 50, resizable: true },
    { columnId: "task", width: 50, resizable: true },
    { columnId: "charge", width: 50, resizable: true },
    { columnId: "plannedStartDate", width: 100, resizable: true },
    { columnId: "plannedEndDate", width: 100, resizable: true },
    { columnId: "estimatedDaysRequired", width: 30, resizable: true },
    { columnId: "actualStartDate", width: 100, resizable: true },
    { columnId: "actualEndDate", width: 100, resizable: true },
    { columnId: "displayName", width: 100, resizable: true },
  ]);

  const headerRow: Row<DefaultCellTypes> = {
    rowId: "header",
    height: 21,
    cells: [
      { type: "header", text: "No" } as HeaderCell,
      { type: "header", text: "Major" } as HeaderCell,
      { type: "header", text: "Middle" } as HeaderCell,
      { type: "header", text: "Sub" } as HeaderCell,
      { type: "header", text: "Task" } as HeaderCell,
      { type: "header", text: "Charge" } as HeaderCell,
      { type: "header", text: "PlanStart" } as HeaderCell,
      { type: "header", text: "PlanEnd" } as HeaderCell,
      { type: "header", text: "Estimate" } as HeaderCell,
      { type: "header", text: "ActStart" } as HeaderCell,
      { type: "header", text: "ActEnd" } as HeaderCell,
      { type: "header", text: "DisplayName" } as HeaderCell,
    ]
  };
  
  const getRows = (data: WBSData[]): Row<DefaultCellTypes>[] => {
    const columnCount = columns.length;

    return [
      headerRow,
      ...data.map((item, index) => {
        let rowCells = [];
        if (item.rowType === 'Chart') {
          const chartRow = item as ChartRow;
          rowCells = [
            { type: "number", value: chartRow.no } as NumberCell,
            { type: "text", text: chartRow.majorCategory } as TextCell,
            { type: "text", text: chartRow.middleCategory } as TextCell,
            { type: "text", text: chartRow.subCategory } as TextCell,
            { type: "text", text: chartRow.task } as TextCell,
            { type: "text", text: chartRow.charge } as TextCell,
            { type: "text", text: formatDate(chartRow.plannedStartDate) } as TextCell,
            { type: "text", text: formatDate(chartRow.plannedEndDate) } as TextCell,
            { type: "text", text: chartRow.estimatedDaysRequired } as TextCell,
            { type: "text", text: formatDate(chartRow.actualStartDate) } as TextCell,
            { type: "text", text: formatDate(chartRow.actualEndDate) } as TextCell,
            { type: "text", text: chartRow.displayName } as TextCell,
          ];
        } else if (item.rowType === 'Separator') {
          const separatorRow = item as SeparatorRow;
          rowCells = [
            { type: "number", value: separatorRow.no } as NumberCell,
            { type: "text", text: separatorRow.displayName } as TextCell
          ];
        } else if (item.rowType === 'Event') {
          const eventRow = item as EventRow;
          rowCells = [
            { type: "number", value: eventRow.no } as NumberCell,
            { type: "text", text: eventRow.displayName } as TextCell
          ];
        } else {
          rowCells = [{ type: "text", text: '' } as TextCell];
        }
        // 足りないセルを空白で埋める
        while (rowCells.length < columnCount) {
          rowCells.push({ type: "text", text: '' } as TextCell);
        }
  
        return {
          rowId: item.id,
          height: 21,
          cells: rowCells
        };
      })
    ];
  };

  const handleChanges = (changes: CellChange[]) => {
    const currentState = { ...data };
    const updatedData = { ...currentState };
  
    changes.forEach((change) => {
      const rowId = change.rowId;
      const fieldName = change.columnId as keyof WBSData;
  
      if (updatedData[rowId] && fieldName in updatedData[rowId]) {
        if (change.newCell.type === 'text') {
          updatedData[rowId] = {
            ...updatedData[rowId],
            [fieldName]: (change.newCell as TextCell).text,
          };
        }
        // 他のセルタイプに対する処理もここに追加する
      }
    });
  
    dispatch(setData(updatedData));
  };

  const handleColumnResize = (columnId: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex(col => col.columnId === columnId);
      const updatedColumns = [...prevColumns];
      updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], width };
      return updatedColumns;
    });
  };
  
const assignIds = (data: WBSData[]): { [id: string]: WBSData } => {
  const dataWithIdsAndNos: { [id: string]: WBSData } = {};
  data.forEach((row, index) => {
    const id = uuidv4();
    dataWithIdsAndNos[id] = { ...row, id, no: index + 1 };
  });
  return dataWithIdsAndNos;
};

const simpleHandleContextMenu = (
  selectedRowIds: Id[],
  selectedColIds: Id[],
  selectionMode: SelectionMode,
  menuOptions: MenuOption[]
  ): MenuOption[] => {
    return [
      ...menuOptions,
      {
        id: "addChartRowBelow",
        label: "Add Chart Row Below",
        handler: () => {
          const newDataArray = dataArray.slice();
          const maxIndex = Math.max(...selectedRowIds.map(id => 
            newDataArray.findIndex(item => item.id === id)));
          for (let i = 0; i < selectedRowIds.length; i++) {
              const newDataRow: WBSData = {
            rowType: "Chart",
            no: 0,
            id: "",
            majorCategory: "",
            middleCategory: "",
            subCategory: "",
            task: "",
            charge: "",
            plannedStartDate: "",
            plannedEndDate: "",
            estimatedDaysRequired: "",
            actualStartDate: "",
            actualEndDate: "",
            comment: "",
            displayName: ""
          };
          newDataArray.splice(maxIndex + 1 + i, 0, newDataRow);
        }
        dispatch(setData(assignIds(newDataArray)));
      }
    },
      {
        id: "removeSelectedRow",
        label: "Remove Selected Row",
        handler: () => {
          const newDataArray = dataArray.filter(item => 
            !selectedRowIds.includes(item.id));
          dispatch(setData(assignIds(newDataArray)));
        }
      }
    ];
  };

  const dataArray = Object.values(data);
  const rows = getRows(dataArray);

  return (
    <ReactGrid
      rows={rows}
      columns={columns}
      onCellsChanged={handleChanges}
      onColumnResized={handleColumnResize}
      onContextMenu={simpleHandleContextMenu}
      stickyTopRows={1}
      enableRangeSelection
      enableRowSelection
      enableFillHandle
    />
  );
});

export default memo(WBSInfo);