// GanttCell.tsx
import React from 'react';
import { Cell, DisplayLabel } from '../styles/GanttStyles';

interface MemoedCellProps {
  type: string;
  isPlanned: boolean;
  isHovered?: boolean;
  isActual?: boolean;
  charge?: string;
  displayName?: string;
  onDoubleClick?: () => void;
  onClick?: () => void;
  onMouseMove?: () => void;
}

const MemoedCell: React.FC<MemoedCellProps> = ({ 
  type, 
  isPlanned, 
  isHovered, 
  isActual, 
  charge, 
  displayName,
  onDoubleClick, 
  onClick, 
  onMouseMove 
}) => {
  return (
    <Cell
      $type={type}
      $isPlanned={isPlanned}
      $isHovered={isHovered}
      $isActual={isActual}
      $charge={charge}
      onDoubleClick={onDoubleClick}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      {displayName ? (
        <DisplayLabel $isHovered={isHovered}>{displayName}</DisplayLabel>
      ) : null}
    </Cell>
  );
};

export const MemoizedCell = React.memo(MemoedCell);