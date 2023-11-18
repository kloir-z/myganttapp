// GanttCell.tsx
import React from 'react';
import { Cell } from '../styles/GanttStyles';
import AutoWidthInputBox from './AutoWidthInputBox';

interface MemoedChartCellProps {
  entryId? : string;
  type?: string;
  isPlanned?: boolean;
  isActual?: boolean;
  charge?: string;
  width?:number;
}

const MemoedChartCell: React.FC<MemoedChartCellProps> = ({ 
  entryId,
  type,
  isPlanned,
  isActual,
  charge,
  width
}) => {
  return (
    <Cell
      $type={type}
      $isPlanned={isPlanned}
      $isActual={isActual}
      $charge={charge}
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