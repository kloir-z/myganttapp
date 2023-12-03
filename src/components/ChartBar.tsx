import React from 'react';
import { ChartCell } from './ChartCell';

interface ChartBarProps {
  startDate: Date | null;
  endDate: Date | null;
  dateArray: Date[];
  isActual: boolean;
  entryId: string;
  charge?: string;
}

const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const ChartBar: React.FC<ChartBarProps> = ({ startDate, endDate, dateArray, isActual, entryId, charge }) => {
  if (!startDate || !endDate) {
    return null;
  }

  const endOfDay = getStartOfDay(endDate);
  const startIndex = dateArray.findIndex(date => date >= startDate);
  let endIndex = dateArray.findIndex(date => date > endOfDay);
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
      <div style={{position: 'absolute', left: `${leftPosition}px`, width: `${width}px`}}>
        <ChartCell
          entryId={entryId}
          isActual={isActual}
          isPlanned={!isActual}
          charge={charge}
          width={width}
        />
      </div>
    );
  }

  return null;
};

export default ChartBar;
