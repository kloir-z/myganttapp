// hooks/useWBSData.ts
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reduxComponents/store';
import { Column, Row, DefaultCellTypes, HeaderCell } from "@silevis/reactgrid";

export const useWBSData = () => {
  const data = useSelector((state: RootState) => state.wbsData);

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
  
  return { data, columns, setColumns, headerRow };
};