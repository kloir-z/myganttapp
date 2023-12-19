// DataTypes.ts
export type RowType = "Chart" | "Separator" | "Event";

export interface BaseRow {
  no: number;
  id: string;
  rowType: RowType;
  displayName: string;
}

export interface ChartRow extends BaseRow {
  rowType: "Chart";
  majorCategory: string;
  middleCategory: string;
  subCategory: string;
  task: string;
  color: string;
  plannedStartDate: string;
  plannedEndDate: string;
  businessDays: number,
  actualStartDate: string;
  actualEndDate: string;
  comment: string;
  chain: string;
  chainNo: number | null;
}

export interface SeparatorRow extends BaseRow {
  rowType: "Separator";
  comment: string;
}

export interface EventData {
  displayName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  businessDays: 5,
  actualStartDate: string;
  actualEndDate: string;
  comment: string;
}

export interface EventRow extends BaseRow {
  rowType: "Event";
  displayName: string;
  eventData: EventData[];
}

export type WBSData = ChartRow | SeparatorRow | EventRow;