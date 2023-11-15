// GanttCell.tsx
import React from 'react';
import { Cell, InputBox } from '../styles/GanttStyles';
import { useSelector, useDispatch } from 'react-redux';
import { setDisplayName} from '../reduxComponents/store';

interface MemoedChartCellProps {
  entryId? : string;
  type?: string;
  isPlanned?: boolean;
  isActual?: boolean;
  charge?: string;
  displayName?: string;
  width?:number;
}

const MemoedChartCell: React.FC<MemoedChartCellProps> = ({ 
  entryId,
  type, 
  isPlanned, 
  isActual, 
  charge, 
  displayName,
  width
}) => {
  const dispatch = useDispatch();
  return (
    <Cell
      $type={type}
      $isPlanned={isPlanned}
      $isActual={isActual}
      $charge={charge}
      $width={width}
      style={{display: 'flex'}}
    >
      {(displayName && entryId) ? (
        <InputBox value={displayName} onChange={(e) => dispatch(setDisplayName({id: entryId, displayName: e.target.value}))} $inputSize={displayName.length}/>
      ) : null}
    </Cell>
  );
};

export const ChartCell = React.memo(MemoedChartCell);