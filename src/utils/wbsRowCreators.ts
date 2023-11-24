// wbsRowCreators.ts
import { ChartRow, SeparatorRow, EventRow } from '../types/DataTypes';
import { Row, DefaultCellTypes, NumberCell, TextCell, Column } from "@silevis/reactgrid";
import { CustomDateCell } from '../utils/CustomDateCell';

const fillEmptyCells = (cells: (NumberCell | TextCell | CustomDateCell)[], columnCount: number, cellType: "text" | "customDate" = "text", style?: any) => {
  while (cells.length < columnCount) {
    let emptyCell: TextCell | CustomDateCell;
    switch (cellType) {
      case "customDate":
        emptyCell = { type: "customDate", text: "", shortDate: "", value: NaN, style };
        break;
      default:
        emptyCell = { type: "text", text: "", style };
    }
    cells.push(emptyCell);
  }
};

export const createChartRow = (chartRow: ChartRow, columns: Column[]): Row<DefaultCellTypes | CustomDateCell> => {
  const rowCells = columns.map(column => {
    const columnId = column.columnId as string;
    const cellValue = (chartRow as any)[columnId];
    if (["plannedStartDate", "plannedEndDate", "actualStartDate", "actualEndDate"].includes(columnId)) {
      return { type: "customDate", text: cellValue, value: NaN } as CustomDateCell;
    }
    else if (columnId === "no") {
      return { type: "number", value: cellValue as number, style: { background: 'rgba(128, 128, 128, 0.1)'} } as NumberCell;
    }
    else {
      return { type: "text", text: cellValue as string } as TextCell;
    }
  });
  return { rowId: chartRow.id, height: 21, cells: rowCells };
};

export const createSeparatorRow = (separatorRow: SeparatorRow, columnCount: number): Row<DefaultCellTypes> => {
  const rowCells = [
    { type: "number", value: separatorRow.no, isEditing: false, style: { background: 'rgba(128, 128, 128, 0.1)'} } as NumberCell,
    { type: "text", text: separatorRow.displayName, colspan: 10, style: { background: '#ddedff' } } as TextCell
  ];
  fillEmptyCells(rowCells, columnCount, "text", { background: '#ddedff' });
  return { rowId: separatorRow.id, height: 21, cells: rowCells as any[] };
};

export const createEventRow = (eventRow: EventRow, columnCount: number): Row<DefaultCellTypes> => {
  const rowCells = [
    { type: "number", value: eventRow.no, isEditing: false, style: { background: 'rgba(128, 128, 128, 0.1)'} } as NumberCell,
    { type: "text", text: eventRow.displayName } as TextCell
  ];
  fillEmptyCells(rowCells, columnCount);
  return {rowId: eventRow.id, height: 21, cells: rowCells};
};
