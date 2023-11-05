// Calendar.tsx
import React from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { Row, Cell } from '../styles/GanttStyles';

interface CalendarProps {
  dateArray: Date[];
};

const Calendar: React.FC<CalendarProps> = ({ dateArray }) => {

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Row style={{ position: 'relative', borderBottom: 'none' }}>
        {dateArray.map((date, index) => {
          if (date.getDate() === 1) {
            const left = 21 * index;
            return (
              <Cell 
                key={index} 
                style={{
                  position: 'absolute',
                  left: `${left}px`
                }}
              >
                {date.getFullYear()}/{String(date.getMonth() + 1).padStart(2, '0')}
              </Cell>
            );
          }
          return null;
        })}
      </Row>
      <Row style={{ position: 'relative' }}>
        {dateArray.map((date, index) => {
          let type = 'weekday';
          if (date.getDay() === 6) type = 'saturday';
          if (date.getDay() === 0 || isHoliday(date)) type = 'sundayOrHoliday';
          const left = 21 * index;

          return (
            <Cell
              key={index}
              $type={type}
              className="dayColumn"
              style={{
                position: 'absolute',
                left: `${left}px`,
                height: '23px',
                borderTop: '1px solid #80808047'
              }}
            >
              {date.getDate()}
            </Cell>
          );
        })}
      </Row>
    </div>
  );
};

export default Calendar;