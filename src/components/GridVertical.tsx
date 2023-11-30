// GridVertial.tsx
import React, { memo } from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { GanttRow, Cell } from '../styles/GanttStyles';

interface CalendarProps {
  dateArray: Date[];
  gridHeight: string;
};

const GridVertical: React.FC<CalendarProps> = memo(({ dateArray, gridHeight }) => {
  return (
    <GanttRow style={{height: '0px', borderBottom: 'none'}}>
      {dateArray.map((date, index) => {
        let type = 'weekday';

        if (date.getDay() === 6) type = 'saturday';
        if (date.getDay() === 0 || isHoliday(date)) type = 'sundayOrHoliday';
        const left = 21 * index;

        return (
          <Cell
            key={index}
            data-index={index}
            $type={type}
            style={{
              position: 'absolute',
              top: '0px',
              left: `${left}px`,
              height: gridHeight,
            }}
          />
        );
      })}
    </GanttRow>
  );
});

export default memo(GridVertical);