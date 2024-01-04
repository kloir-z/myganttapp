// hooks/useWBSData.ts
import { useState, useEffect } from 'react';
import { Column, Row, DefaultCellTypes, HeaderCell } from "@silevis/reactgrid";

export interface ColumnMap {
  no: 'No';
  textColumn1: 'C1';
  textColumn2: 'C2';
  textColumn3: 'C3';
  textColumn4: 'C4';
  color: 'Color';
  plannedStartDate: 'PlanS';
  plannedEndDate: 'PlanE';
  businessDays: 'D';
  actualStartDate: 'ActS';
  actualEndDate: 'ActE';
  displayName: 'DisplayName';
  dependency: 'Dep';
  dependentId: 'DepId';
  id: 'id'
}

export const columnMap: ColumnMap = {
  no: 'No',
  textColumn1: 'C1',
  textColumn2: 'C2',
  textColumn3: 'C3',
  textColumn4: 'C4',
  color: 'Color',
  plannedStartDate: 'PlanS',
  plannedEndDate: 'PlanE',
  businessDays: 'D',
  actualStartDate: 'ActS',
  actualEndDate: 'ActE',
  displayName: 'DisplayName',
  dependency: 'Dep',
  dependentId: 'DepId',
  id: 'id'
};

export const useWBSData = () => {
  const initialColumns: Column[] = [
    { columnId: "no", width: 30, resizable: false },
    { columnId: "displayName", width: 100, resizable: true, reorderable: true },
    { columnId: "textColumn1", width: 50, resizable: true, reorderable: true },
    { columnId: "textColumn2", width: 50, resizable: true, reorderable: true },
    { columnId: "textColumn3", width: 50, resizable: true, reorderable: true },
    { columnId: "textColumn4", width: 50, resizable: true, reorderable: true },
    { columnId: "color", width: 50, resizable: true, reorderable: true },
    { columnId: "plannedStartDate", width: 40, resizable: true, reorderable: true },
    { columnId: "plannedEndDate", width: 40, resizable: true, reorderable: true },
    { columnId: "businessDays", width: 30, resizable: true, reorderable: true },
    { columnId: "actualStartDate", width: 40, resizable: true, reorderable: true },
    { columnId: "actualEndDate", width: 40, resizable: true, reorderable: true },
    { columnId: "dependency", width: 40, resizable: true, reorderable: true },
  ];
  const [originalColumns, setOriginalColumns] = useState<Column[]>(initialColumns);
  const [columns, setColumns] = useState<Column[]>(initialColumns);

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
  }, [columns]);

  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>(
    initialColumns.reduce((acc, column) => ({ ...acc, [column.columnId]: true }), {})
  );

  const toggleColumnVisibility = (columnId: string | number) => {
    setColumnVisibility(prev => {
      const newVisibility = { ...prev, [columnId]: !prev[columnId] };
      const newColumns = originalColumns.filter(column => newVisibility[column.columnId]);
      setColumns(newColumns);
      return newVisibility;
    });
  };

  useEffect(() => {
    const filteredColumns = originalColumns.filter(column => columnVisibility[column.columnId]);
    setHeaderRow(getHeaderRow(filteredColumns, columnMap));
  }, [originalColumns, columnVisibility]);

  return { initialColumns, columns, setColumns, headerRow, columnVisibility, toggleColumnVisibility };
}