// WBSInfo.tsx
import React, { useCallback, memo } from 'react';
import { WBSData, ChartRow, SeparatorRow, EventRow  } from '../types/DataTypes';
import { ReactGrid, Row, DefaultCellTypes, TextCell, Id, MenuOption, SelectionMode } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useWBSData } from '../hooks/useWBSData';
import { handleAddChartRowBelow, handleAddSeparatorRowBelow, handleRemoveSelectedRow } from '../utils/contextMenuHandlers';
import { createChartRow, createSeparatorRow, createEventRow } from '../utils/wbsRowCreators';
import { handleGridChanges } from '../utils/gridHandlers';
import { useColumnResizer } from '../hooks/useColumnResizer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setData } from '../reduxComponents/store';
import { CustomDateCell, CustomDateCellTemplate } from '../utils/CustomDateCell';
import { CustomTextCell, CustomTextCellTemplate } from '../utils/CustomTextCell';
import { assignIds, reorderArray } from '../utils/wbsHelpers';

const WBSInfo: React.FC = memo(({}) => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.wbsData);
  const { headerRow, columns, setColumns } = useWBSData();
  const handleColumnResize = useColumnResizer(setColumns);
  const dataArray = Object.values(data);
  const customDateCellTemplate = new CustomDateCellTemplate();
  const customTextCellTemplate = new CustomTextCellTemplate();  

  const getRows = useCallback((data: WBSData[]): Row<DefaultCellTypes | CustomDateCell | CustomTextCell>[] => {
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
            return { rowId: 'empty', height: 21, cells: [{ type: "customText", text: '' } as CustomTextCell], reorderable: true };
        }
      })
    ];
  }, [data, columns, headerRow]);

  const rows = getRows(dataArray);

  const simpleHandleContextMenu = useCallback((
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
  }, [dispatch, dataArray]);

  const handleRowsReorder = useCallback((targetRowId: Id, rowIds: Id[]) => {
    const targetIndex = dataArray.findIndex(data => data.id === targetRowId);
    const movingRowsIndexes = rowIds.map(id => dataArray.findIndex(data => data.id === id));
  
    const reorderedData = reorderArray(dataArray, movingRowsIndexes, targetIndex);
  
    dispatch(setData(assignIds(reorderedData)));
  }, [dataArray, dispatch]);

  const handleColumnsReorder = useCallback((targetColumnId: Id, columnIds: Id[]) => {
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
  }, [columns, setColumns]);

  const handleCanReorderRows = (targetRowId: Id, rowIds: Id[]): boolean => {
    return targetRowId !== 'header';
  }

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
      canReorderRows={handleCanReorderRows}
      customCellTemplates={{ customDate: customDateCellTemplate, customText: customTextCellTemplate }}
    />
  );
});

export default memo(WBSInfo);