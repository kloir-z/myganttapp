// GanttCell.tsx
import React from 'react';
import { Cell } from '../styles/GanttStyles';
import { useSelector, useDispatch } from 'react-redux';
import { setDisplayName} from '../reduxComponents/store';
import AutoWidthInputBox from './AutoWidthInputBox';

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
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (entryId) {
      dispatch(setDisplayName({ id: entryId, displayName: e.target.value }));
    }
  };
  return (
    <Cell
      $type={type}
      $isPlanned={isPlanned}
      $isActual={isActual}
      $charge={charge}
      $width={width}
      style={{position: 'relative'}}
    >
      {isPlanned && (
        <AutoWidthInputBox 
          value={displayName}
          onChange={handleDisplayNameChange}
        />
      )}
    </Cell>
  );
};

export const ChartCell = React.memo(MemoedChartCell);