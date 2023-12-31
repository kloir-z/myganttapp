import { Dispatch, SetStateAction } from 'react';
import { Id, Column } from "@silevis/reactgrid";

export const useColumnResizer = (setColumns: Dispatch<SetStateAction<Column[]>>) => {
  const handleColumnResize = (columnId: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex(col => col.columnId === columnId);
      const updatedColumns = [...prevColumns];
      updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], width };
      return updatedColumns;
    });
  };

  return handleColumnResize;
};