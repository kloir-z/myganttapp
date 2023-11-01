// GanttCell.tsx
import React from 'react';
import { Cell, DisplayLabel } from '../styles/GanttStyles';

interface MemoedCellProps {
  type?: string;
  isPlanned?: boolean;
  isActual?: boolean;
  charge?: string;
  displayName?: string;
  width?:number;
}

const MemoedCell: React.FC<MemoedCellProps> = ({ 
  type, 
  isPlanned, 
  isActual, 
  charge, 
  displayName,
  width
}) => {
  return (
    <Cell
      $type={type}
      $isPlanned={isPlanned}
      $isActual={isActual}
      $charge={charge}
      $width={width}
    >
      {displayName ? (
        <DisplayLabel>{displayName}</DisplayLabel>
      ) : null}
    </Cell>
  );
};

export const MemoizedCell = React.memo(MemoedCell);