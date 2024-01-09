// WBSInfo.tsx
import React, { useCallback, memo, Dispatch, SetStateAction } from 'react';
import { WBSData, ChartRow, SeparatorRow, EventRow  } from '../types/DataTypes';
import { ReactGrid, Row, DefaultCellTypes, Id, MenuOption, SelectionMode, Column } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { handleAddChartRow, handleAddSeparatorRow, handleRemoveSelectedRow } from '../utils/contextMenuHandlers';
import { createChartRow, createSeparatorRow, createEventRow } from '../utils/wbsRowCreators';
import { handleGridChanges } from '../utils/gridHandlers';
import { useColumnResizer } from '../hooks/useColumnResizer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, simpleSetData } from '../reduxComponents/store';
import { CustomDateCell, CustomDateCellTemplate } from '../utils/CustomDateCell';
import { CustomTextCell, CustomTextCellTemplate } from '../utils/CustomTextCell';
import { assignIds, reorderArray } from '../utils/wbsHelpers';
import { ExtendedColumn } from '../hooks/useWBSData';

type WBSInfoProps = {
  headerRow: Row<DefaultCellTypes>;
  visibleColumns: ExtendedColumn[];
  setColumns: Dispatch<SetStateAction<ExtendedColumn[]>>;
  toggleColumnVisibility: (columnId: string | number) => void;
};

const WBSInfo: React.FC<WBSInfoProps> = ({ headerRow, visibleColumns, setColumns, toggleColumnVisibility }) => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.wbsData.data);
  const handleColumnResize = useColumnResizer(setColumns);
  const dataArray = Object.values(data);
  const customDateCellTemplate = new CustomDateCellTemplate();
  const customTextCellTemplate = new CustomTextCellTemplate();  

  const getRows = useCallback((data: WBSData[]): Row<DefaultCellTypes | CustomDateCell | CustomTextCell>[] => {
    return [
      headerRow,
      ...data.map((item) => {
        switch (item.rowType) {
          case 'Chart':
            return createChartRow(item as ChartRow, visibleColumns);
          case 'Separator':
            return createSeparatorRow(item as SeparatorRow, visibleColumns.length);
          case 'Event':
            return createEventRow(item as EventRow, visibleColumns.length);  
          default:
            return { rowId: 'empty', height: 21, cells: [{ type: "customText", text: '' } as CustomTextCell], reorderable: true };
        }
      })
    ];
  }, [visibleColumns, headerRow]);

  const rows = getRows(dataArray);

  const simpleHandleContextMenu = useCallback((
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[],
  ): MenuOption[] => {
    if (selectionMode === 'column') {
      menuOptions.push({
        id: "hideColumn",
        label: "Hide Column",
        handler: () => selectedColIds.forEach(colId => toggleColumnVisibility(colId))
      });
    }
    if (selectionMode === 'row') {
      menuOptions.push(
        {
          id: "addChartRow",
          label: "Add Chart Row",
          handler: () => handleAddChartRow(dispatch, selectedRowIds, dataArray)
        },
        {
          id: "addSeparatorRow",
          label: "Add Separator Row",
          handler: () => handleAddSeparatorRow(dispatch, selectedRowIds, dataArray)
        },
        {
          id: "removeSelectedRow",
          label: "Remove Selected Row",
          handler: () => handleRemoveSelectedRow(dispatch, selectedRowIds, dataArray)
        }
      );
    }
    return menuOptions;
  }, [dispatch, dataArray, toggleColumnVisibility]);

  const handleRowsReorder = useCallback((targetRowId: Id, rowIds: Id[]) => {
    const targetIndex = dataArray.findIndex(data => data.id === targetRowId);
    const movingRowsIndexes = rowIds.map(id => dataArray.findIndex(data => data.id === id));
  
    const reorderedData = reorderArray(dataArray, movingRowsIndexes, targetIndex);
  
    dispatch(simpleSetData(assignIds(reorderedData)));
  }, [dataArray, dispatch]);

  const handleColumnsReorder = useCallback((targetColumnId: Id, columnIds: Id[]) => {
    const newColumnsOrder = [...visibleColumns];
    const targetIndex = newColumnsOrder.findIndex(column => column.columnId === targetColumnId);
  
    columnIds.forEach(columnId => {
      const index = newColumnsOrder.findIndex(column => column.columnId === columnId);
      if (index >= 0) {
        const [column] = newColumnsOrder.splice(index, 1);
        newColumnsOrder.splice(targetIndex, 0, column);
      }
    });
  
    setColumns(newColumnsOrder);
  }, [visibleColumns, setColumns]);

  const handleCanReorderRows = (targetRowId: Id, rowIds: Id[]): boolean => {
    return targetRowId !== 'header';
  }

  return (
    <ReactGrid
      rows={rows}
      columns={visibleColumns}
      onCellsChanged={(changes) => handleGridChanges(dispatch, data, changes)}
      onColumnResized={handleColumnResize}
      onContextMenu={simpleHandleContextMenu}
      stickyTopRows={1}
      stickyLeftColumns={1}
      enableRangeSelection
      enableColumnSelection
      enableRowSelection
      onRowsReordered={handleRowsReorder}
      onColumnsReordered={handleColumnsReorder}
      canReorderRows={handleCanReorderRows}
      customCellTemplates={{ customDate: customDateCellTemplate, customText: customTextCellTemplate }}
      minColumnWidth={10}
    />
  );
};

export default memo(WBSInfo);