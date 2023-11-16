// GridVertial.tsx
import React, { memo } from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { GanttRow, Cell } from '../styles/GanttStyles';

interface CalendarProps {
  dateArray: Date[];
};

const GridVertical: React.FC<CalendarProps> = memo(({ dateArray }) => {
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
              height: `calc(100vh - 41px)`,
            }}
          />
        );
      })}
    </GanttRow>
  );
});

export default memo(GridVertical);