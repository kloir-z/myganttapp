// Calendar.tsx
import React, { memo } from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { GanttRow, Cell } from '../styles/GanttStyles';

interface CalendarProps {
  dateArray: Date[];
};

const Calendar: React.FC<CalendarProps> = memo(({ dateArray }) => {
  let previousMonth = dateArray[0].getMonth();
  const calendarWidth = dateArray.length * 21;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: `${calendarWidth}px` }}>
      <GanttRow style={{ borderBottom: 'none', background: 'none'}}>
        {dateArray.map((date, index) => {
          const month = date.getMonth();
          if (month !== previousMonth || index === 0) {
            previousMonth = month;
            const left = 21 * index;
            return (
              <Cell 
                key={index} 
                data-index={index}
                style={{
                  position: 'absolute',
                  left: `${left}px`
                }}
              >
                {date.getFullYear()}/{String(month + 1).padStart(2, '0')}
              </Cell>
            );
          }
          return null;
        })}
      </GanttRow>
      <GanttRow style={{ borderBottom: 'none', background: 'none'}}>
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
                left: `${left}px`,
                height: '21px',
                borderTop: '1px solid #00000016',
                borderBottom: '1px solid #00000016',
              }}
            >
              {date.getDate()}
            </Cell>
          );
        })}
      </GanttRow>
    </div>
  );
});

export default memo(Calendar);