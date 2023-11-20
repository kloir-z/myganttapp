import { ChartRow, SeparatorRow, EventRow } from '../types/DataTypes';
import { Row, DefaultCellTypes, NumberCell, TextCell, DateCell } from "@silevis/reactgrid";
import { SeparatorCell } from '../components/SeparatorCellTemplate';

const fillEmptyCells = (cells: (NumberCell | TextCell | DateCell | SeparatorCell)[], columnCount: number, cellType: "text" | "date" | "separator" = "text") => {
  while (cells.length < columnCount) {
    let emptyCell: TextCell | DateCell | SeparatorCell;

    switch (cellType) {
      case "date":
        emptyCell = { type: "date", date: new Date() };
        break;
      case "separator":
        emptyCell = { type: "separator", text: "" };
        break;
      default:
        emptyCell = { type: "text", text: "" };
    }
    cells.push(emptyCell);
  }
};

export const createChartRow = (chartRow: ChartRow, columnCount: number): Row<DefaultCellTypes> => {
  const rowCells = [
    { type: "number", value: chartRow.no } as NumberCell,
    { type: "text", text: chartRow.majorCategory } as TextCell,
    { type: "text", text: chartRow.middleCategory } as TextCell,
    { type: "text", text: chartRow.subCategory } as TextCell,
    { type: "text", text: chartRow.task } as TextCell,
    { type: "text", text: chartRow.charge } as TextCell,
    { type: "date", date: new Date(chartRow.plannedStartDate) } as DateCell,
    { type: "date", date: new Date(chartRow.plannedEndDate) } as DateCell,
    { type: "text", text: chartRow.estimatedDaysRequired } as TextCell,
    { type: "date", date: new Date(chartRow.actualStartDate) } as DateCell,
    { type: "date", date: new Date(chartRow.actualEndDate) } as DateCell,
    { type: "text", text: chartRow.displayName } as TextCell,
  ];
  fillEmptyCells(rowCells, columnCount);
  return {rowId: chartRow.id, height: 21, cells: rowCells};
};

export const createSeparatorRow = (separatorRow: SeparatorRow, columnCount: number): Row<DefaultCellTypes | SeparatorCell> => {
  const rowCells = [
    { type: "number", value: separatorRow.no } as NumberCell,
    { type: "separator", text: separatorRow.displayName } as SeparatorCell
  ];
  fillEmptyCells(rowCells, columnCount, "separator");
  return { rowId: separatorRow.id, height: 21, cells: rowCells as any[] };
};

export const createEventRow = (eventRow: EventRow, columnCount: number): Row<DefaultCellTypes> => {
  const rowCells = [
    { type: "number", value: eventRow.no } as NumberCell,
    { type: "text", text: eventRow.displayName } as TextCell
  ];
  fillEmptyCells(rowCells, columnCount);
  return {rowId: eventRow.id, height: 21, cells: rowCells};
};
