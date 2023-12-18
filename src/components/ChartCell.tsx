// GanttCell.tsx
import React from 'react';
import { Cell } from '../styles/GanttStyles';
import AutoWidthInputBox from './AutoWidthInputBox';
import { ChartBarColor } from '../types/ChartTypes';

interface MemoedChartCellProps {
  entryId? : string;
  type?: string;
  isPlanned?: boolean;
  isActual?: boolean;
  chartBarColor?: ChartBarColor;
  charge?: string;
  width?:number;
}

const MemoedChartCell: React.FC<MemoedChartCellProps> = ({ 
  entryId,
  type,
  isPlanned,
  isActual,
  chartBarColor,
  charge,
  width
}) => {
  return (
    <Cell
      $type={type}
      $isPlanned={isPlanned}
      $isActual={isActual}
      $charge={charge}
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