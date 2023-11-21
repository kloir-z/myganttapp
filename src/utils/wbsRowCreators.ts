// wbsRowCreators.ts
import { ChartRow, SeparatorRow, EventRow } from '../types/DataTypes';
import { Row, DefaultCellTypes, NumberCell, TextCell, DateCell, Column } from "@silevis/reactgrid";

const fillEmptyCells = (cells: (NumberCell | TextCell | DateCell)[], columnCount: number, cellType: "text" | "date" = "text", style?: any) => {
  while (cells.length < columnCount) {
    let emptyCell: TextCell | DateCell;

    switch (cellType) {
      case "date":
        emptyCell = { type: "date", date: new Date(), style };
        break;
      default:
        emptyCell = { type: "text", text: "", style };
    }
    cells.push(emptyCell);
  }
};
export const createChartRow = (chartRow: ChartRow, columns: Column[]): Row<DefaultCellTypes> => {
  const rowCells = columns.map(column => {
    switch (column.columnId) {
      case "no":
        return { type: "number", value: chartRow.no, style: { background: 'rgba(128, 128, 128, 0.1)'} } as NumberCell;
      case "majorCategory":
        return { type: "text", text: chartRow.majorCategory } as TextCell;
      case "middleCategory":
        return { type: "text", text: chartRow.middleCategory } as TextCell;
      case "subCategory":
        return { type: "text", text: chartRow.subCategory } as TextCell;
      case "task":
        return { type: "text", text: chartRow.task } as TextCell;
      case "charge":
        return { type: "text", text: chartRow.charge } as TextCell;
      case "plannedStartDate":
        return { type: "date", date: new Date(chartRow.plannedStartDate) } as DateCell;
      case "plannedEndDate":
        return { type: "date", date: new Date(chartRow.plannedEndDate) } as DateCell;
      case "estimatedDaysRequired":
        return { type: "text", text: chartRow.estimatedDaysRequired } as TextCell;
      case "actualStartDate":
        return { type: "date", date: new Date(chartRow.actualStartDate) } as DateCell;
      case "actualEndDate":
        return { type: "date", date: new Date(chartRow.actualEndDate) } as DateCell;
      case "displayName":
        return { type: "text", text: chartRow.displayName } as TextCell;
      default:
        return { type: "text", text: "" } as TextCell;  
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
