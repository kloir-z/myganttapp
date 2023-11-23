// hooks/useWBSData.ts
import { useState, useEffect } from 'react';
import { Column, Row, DefaultCellTypes, HeaderCell } from "@silevis/reactgrid";

interface ColumnMap {
  no: 'No';
  majorCategory: 'Major';
  middleCategory: 'Middle';
  subCategory: 'Sub';
  task: 'Task';
  charge: 'Charge';
  plannedStartDate: 'PlanStart';
  plannedEndDate: 'PlanEnd';
  estimatedDaysRequired: 'Estimate';
  actualStartDate: 'ActStart';
  actualEndDate: 'ActEnd';
  displayName: 'DisplayName';
}

const columnMap: ColumnMap = {
  no: 'No',
  majorCategory: 'Major',
  middleCategory: 'Middle',
  subCategory: 'Sub',
  task: 'Task',
  charge: 'Charge',
  plannedStartDate: 'PlanStart',
  plannedEndDate: 'PlanEnd',
  estimatedDaysRequired: 'Estimate',
  actualStartDate: 'ActStart',
  actualEndDate: 'ActEnd',
  displayName: 'DisplayName',
};

export const useWBSData = () => {

  const [columns, setColumns] = useState<Column[]>([
    { columnId: "no", width: 15, resizable: false },
    { columnId: "displayName", width: 100, resizable: true, reorderable: true },
    { columnId: "majorCategory", width: 50, resizable: true, reorderable: true },
    { columnId: "middleCategory", width: 50, resizable: true, reorderable: true },
    { columnId: "subCategory", width: 50, resizable: true, reorderable: true },
    { columnId: "task", width: 50, resizable: true, reorderable: true },
    { columnId: "charge", width: 50, resizable: true, reorderable: true },
    { columnId: "plannedStartDate", width: 100, resizable: true, reorderable: true },
    { columnId: "plannedEndDate", width: 100, resizable: true, reorderable: true },
    { columnId: "estimatedDaysRequired", width: 30, resizable: true, reorderable: true },
    { columnId: "actualStartDate", width: 100, resizable: true, reorderable: true },
    { columnId: "actualEndDate", width: 100, resizable: true, reorderable: true },
  ]);

  const getHeaderRow = (columns: Column[], columnMap: ColumnMap): Row<DefaultCellTypes> => {
    const cells = columns.map(column => {
      const headerText = columnMap[column.columnId as keyof ColumnMap];
      return { type: "header", text: headerText ?? "" } as HeaderCell;
    });
  
    return {
      rowId: "header",
      height: 21,
      cells: cells
    };
  };  

  const [headerRow, setHeaderRow] = useState<Row<DefaultCellTypes>>(getHeaderRow(columns, columnMap));

  useEffect(() => {
    setHeaderRow(getHeaderRow(columns, columnMap));
  }, [columns, columnMap]);
  
  return { columns, setColumns, headerRow };
};