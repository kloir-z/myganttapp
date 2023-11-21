// WBSInfo.tsx
import React, { memo, useEffect } from 'react';
import { WBSData, ChartRow, SeparatorRow, EventRow  } from '../types/DataTypes';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reduxComponents/store';
import { ReactGrid, Row, DefaultCellTypes, TextCell, Id, MenuOption, SelectionMode } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useWBSData } from '../hooks/useWBSData';
import { handleAddChartRowBelow, handleAddSeparatorRowBelow, handleRemoveSelectedRow } from '../utils/contextMenuHandlers';
import { createChartRow, createSeparatorRow, createEventRow } from '../utils/wbsRowCreators';
import { handleGridChanges } from '../utils/gridHandlers';
import { useColumnResizer } from '../hooks/useColumnResizer';

const WBSInfo: React.FC = memo(({}) => {
  const dispatch = useDispatch();
  const { data, headerRow, columns, setColumns } = useWBSData();
  const handleColumnResize = useColumnResizer(setColumns);
  const dataArray = Object.values(data);

  const getRows = (data: WBSData[]): Row<DefaultCellTypes>[] => {
    const columnCount = columns.length;
    return [
      headerRow,
      ...data.map((item) => {
        switch (item.rowType) {
          case 'Chart':
            return createChartRow(item as ChartRow, columns);
          case 'Separator':
            return createSeparatorRow(item as SeparatorRow, columnCount);
          case 'Event':
            return createEventRow(item as EventRow, columnCount);
          default:
            return { rowId: 'empty', height: 21, cells: [{ type: "text", text: '' } as TextCell] };
        }
      })
    ];
  };
  const rows = getRows(dataArray);

  const simpleHandleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[]
  ): MenuOption[] => {
    return [
      ...menuOptions,
      {
        id: "addChartRowBelow",
        label: "Add Chart Row Below",
        handler: () => handleAddChartRowBelow(dispatch, selectedRowIds, dataArray)
      },
      {
        id: "addSeparatorRowBelow",
        label: "Add Separator Row Below",
        handler: () => handleAddSeparatorRowBelow(dispatch, selectedRowIds, dataArray)
      },
      {
        id: "removeSelectedRow",
        label: "Remove Selected Row",
        handler: () => handleRemoveSelectedRow(dispatch, selectedRowIds, dataArray)
      }
    ];
  };
  
  const handleRowsReorder = (targetRowId: Id, rowIds: Id[]) => {
    // 行の並べ替え処理
  };

  const handleColumnsReorder = (targetColumnId: Id, columnIds: Id[]) => {
    const newColumnsOrder = [...columns];
    const targetIndex = newColumnsOrder.findIndex(column => column.columnId === targetColumnId);
  
    columnIds.forEach(columnId => {
      const index = newColumnsOrder.findIndex(column => column.columnId === columnId);
      if (index >= 0) {
        const [column] = newColumnsOrder.splice(index, 1);
        newColumnsOrder.splice(targetIndex, 0, column);
      }
    });
  
    setColumns(newColumnsOrder);
  };  

  return (
    <ReactGrid
      rows={rows}
      columns={columns}
      onCellsChanged={(changes) => handleGridChanges(dispatch, data, changes)}
      onColumnResized={handleColumnResize}
      onContextMenu={simpleHandleContextMenu}
      stickyTopRows={1}
      stickyLeftColumns={1}
      enableRangeSelection
      enableColumnSelection
      enableRowSelection
      enableFillHandle
      onRowsReordered={handleRowsReorder}
      onColumnsReordered={handleColumnsReorder}
      canReorderRows={(targetRowId, rowIds) => targetRowId !== 'header'}
    />
  );
});

export default memo(WBSInfo);