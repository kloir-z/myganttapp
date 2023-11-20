import React, { memo } from 'react';
import { WBSData, ChartRow, SeparatorRow, EventRow  } from '../types/DataTypes';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reduxComponents/store';
import { ReactGrid, Row, DefaultCellTypes, TextCell, Id, MenuOption, SelectionMode } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useWBSData } from '../hooks/useWBSData';
import { handleAddChartRowBelow, handleRemoveSelectedRow } from '../utils/contextMenuHandlers';
import { createChartRow, createSeparatorRow, createEventRow } from '../utils/wbsRowCreators';
import { handleGridChanges } from '../utils/gridHandlers';
import { useColumnResizer } from '../hooks/useColumnResizer';
import { SeparatorCell, SeparatorCellTemplate } from './SeparatorCellTemplate';

const WBSInfo: React.FC = memo(({}) => {
  const dispatch = useDispatch();
  const { headerRow, columns, setColumns } = useWBSData();
  const handleColumnResize = useColumnResizer(setColumns);
  const data = useSelector((state: RootState) => state.wbsData);
  const dataArray = Object.values(data);
  const separatorCellTemplate = new SeparatorCellTemplate();

  const getRows = (data: WBSData[]): Row<DefaultCellTypes | SeparatorCell>[] => {
    const columnCount = columns.length;
    return [
      headerRow,
      ...data.map((item) => {
        switch (item.rowType) {
          case 'Chart':
            return createChartRow(item as ChartRow, columnCount);
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
        id: "removeSelectedRow",
        label: "Remove Selected Row",
        handler: () => handleRemoveSelectedRow(dispatch, selectedRowIds, dataArray)
      }
    ];
  };

  return (
    <ReactGrid
      rows={rows}
      columns={columns}
      onCellsChanged={(changes) => handleGridChanges(dispatch, data, changes)}
      onColumnResized={handleColumnResize}
      onContextMenu={simpleHandleContextMenu}
      stickyTopRows={1}
      enableRangeSelection
      enableRowSelection
      enableFillHandle
      customCellTemplates={{ separator: separatorCellTemplate }}
    />
  );
});

export default memo(WBSInfo);