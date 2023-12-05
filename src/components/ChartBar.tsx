import React from 'react';
import { ChartCell } from './ChartCell';

interface ChartBarProps {
  startDate: Date | null;
  endDate: Date | null;
  dateArray: Date[];
  isActual: boolean;
  entryId: string;
  charge?: string;
  onBarMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void; 
  onBarEndMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void; 
}

const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const ChartBar: React.FC<ChartBarProps> = ({ startDate, endDate, dateArray, isActual, entryId, charge, onBarMouseDown, onBarEndMouseDown }) => {
  if (!startDate || !endDate) {
    return null;
  }

  const startOfDay = getStartOfDay(startDate);
  const endOfDay = getStartOfDay(endDate);
  let startIndex = dateArray.findIndex(date => date > startOfDay);
  let endIndex = dateArray.findIndex(date => date > endOfDay);
  startIndex = startIndex !== -1 ? startIndex - 1 : dateArray.length - 1;
  endIndex = endIndex !== -1 ? endIndex - 1 : dateArray.length - 1;
  const dateArrayStart = dateArray[0];
  const dateArrayEnd = dateArray[dateArray.length - 1];

  if (startDate > dateArrayEnd || endDate < dateArrayStart) {
    return null;
  }

  if (startIndex !== -1 && endIndex !== -1) {
    const width = ((endIndex - startIndex + 1) * 21) + 0.3;
    const leftPosition = startIndex * 21;

    return (
      <>
        <div
          style={{position: 'absolute', left: `${leftPosition}px`, width: `${width}px`}}
          {...(isActual ? {} : { onMouseDown: onBarMouseDown })}
        >
          <ChartCell
            entryId={entryId}
            isActual={isActual}
            isPlanned={!isActual}
            charge={charge}
            width={width}
          />
        </div>
        <div
          style={{position: 'absolute', left: `${leftPosition + width}px`, width: '8px', height: '21px', cursor: 'ew-resize', opacity: 0 }}
          {...(isActual ? {} : { onMouseDown: onBarEndMouseDown })}
        ></div>
      </>
    );
  }

  return null;
};

export default ChartBar;