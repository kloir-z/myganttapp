// wbsRowCreators.ts
import { ChartRow, SeparatorRow, EventRow } from '../types/DataTypes';
import { Row, DefaultCellTypes, NumberCell, Column } from "@silevis/reactgrid";
import { CustomDateCell } from './CustomDateCell';
import { CustomTextCell } from './CustomTextCell';

const fillEmptyCells = (cells: (NumberCell | CustomTextCell | CustomDateCell)[], columnCount: number, cellType: "customText" | "customDate" = "customText", style?: any) => {
  while (cells.length < columnCount) {
    let emptyCell: CustomTextCell | CustomDateCell;
    switch (cellType) {
      case "customDate":
        emptyCell = { type: "customDate", text: "", shortDate: "", value: NaN, style };
        break;
      default:
        emptyCell = { type: "customText", text: "", value: 0, style };
    }
    cells.push(emptyCell);
  }
};

export const createChartRow = (chartRow: ChartRow, columns: Column[]): Row<DefaultCellTypes | CustomTextCell | CustomDateCell> => {
  const rowCells = columns.map(column => {
    const columnId = column.columnId as string;
    let cellValue = (chartRow as any)[columnId];
    if (columnId === 'chain' && (cellValue === null || cellValue === undefined)) {
      cellValue = '';
    }
    if (["plannedStartDate", "plannedEndDate", "actualStartDate", "actualEndDate"].includes(columnId)) {
      return { type: "customDate", text: cellValue, value: NaN } as CustomDateCell;
    }
    else if (columnId === "no") {
      return { type: "number", value: cellValue as number, style: { background: 'rgba(128, 128, 128, 0.1)'}} as NumberCell;
    }
    else {
      return { type: "customText", text: cellValue as string, value: (cellValue as string).length } as CustomTextCell;
    }
  });
  return { rowId: chartRow.id, height: 21, cells: rowCells, reorderable: true };
};

export const createSeparatorRow = (separatorRow: SeparatorRow, columnCount: number): Row<DefaultCellTypes | CustomTextCell> => {
  const rowCells = [
    { type: "number", value: separatorRow.no, isEditing: false, style: { background: 'rgba(128, 128, 128, 0.1)'} } as NumberCell,
    { type: "customText", text: separatorRow.displayName,value: (separatorRow.displayName.length), colspan: 10, style: { background: '#ddedff' } } as CustomTextCell
  ];
  fillEmptyCells(rowCells, columnCount, "customText", { background: '#ddedff' });
  return { rowId: separatorRow.id, height: 21, cells: rowCells as any[], reorderable: true };
};

export const createEventRow = (eventRow: EventRow, columnCount: number): Row<DefaultCellTypes | CustomTextCell> => {
  const rowCells = [
    { type: "number", value: eventRow.no, isEditing: false, style: { background: 'rgba(128, 128, 128, 0.1)'} } as NumberCell,
    { type: "customText", text: eventRow.displayName, value: eventRow.displayName.length } as CustomTextCell
  ];
  fillEmptyCells(rowCells, columnCount);
  return {rowId: eventRow.id, height: 21, cells: rowCells, reorderable: true };
};