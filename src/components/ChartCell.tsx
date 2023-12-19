// GanttCell.tsx
import React from 'react';
import { Cell } from '../styles/GanttStyles';
import AutoWidthInputBox from './AutoWidthInputBox';
import { ChartBarColor } from '../types/colorAliasMapping';

interface MemoedChartCellProps {
  entryId? : string;
  type?: string;
  isPlanned?: boolean;
  isActual?: boolean;
  chartBarColor?: ChartBarColor;
  width?:number;
}

const MemoedChartCell: React.FC<MemoedChartCellProps> = ({ 
  entryId,
  type,
  isPlanned,
  isActual,
  chartBarColor,
  width
}) => {
  return (
    <Cell
      $type={type}
      $isPlanned={isPlanned}
      $isActual={isActual}
      $chartBarColor={chartBarColor}
      $width={width}
      style={{position: 'relative'}}
    >
      {(isPlanned && entryId) && (
        <AutoWidthInputBox 
          entryId={entryId}
        />
      )}
    </Cell>
  );
};

export const ChartCell = React.memo(MemoedChartCell);