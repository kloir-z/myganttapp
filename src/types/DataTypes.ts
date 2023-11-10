// DataTypes.ts
export type RowType = "Chart" | "Separator" | "Event";

export interface BaseRow {
  id: string;
  rowType: RowType;
  displayName: string;
  isChanged?: boolean;
}

export interface ChartRow extends BaseRow {
  rowType: "Chart";
  majorCategory: string;
  middleCategory: string;
  subCategory: string;
  task: string;
  charge: string;
  plannedStartDate: string;
  plannedEndDate: string;
  estimatedDaysRequired: number;
  actualStartDate: string;
  actualEndDate: string;
  comment: string;
}

export interface SeparatorRow extends BaseRow {
  rowType: "Separator";
  comment: string;
}

export interface EventData {
  displayName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  estimatedDaysRequired: number;
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