// Calendar.tsx
import React from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { Row, Cell } from '../styles/GanttStyles';

interface CalendarProps {
  dateArray: Date[];
};

const Calendar: React.FC<CalendarProps> = ({ dateArray }) => {
  let previousMonth = dateArray[0].getMonth();
  const calendarWidth = dateArray.length * 21;

  return (
    <div style={{display: 'flex', flexDirection: 'column', position: 'fixed', zIndex: 2000, left: '650px'}}>
      <Row style={{ position: 'relative', borderBottom: 'none', zIndex: 2000, backgroundColor: 'white', width: `${calendarWidth}px`}}>
        {dateArray.map((date, index) => {
          const month = date.getMonth();
          if (month !== previousMonth || index === 0) { // 最初の要素、または新しい月の始まりの場合
            previousMonth = month; // 現在の月を更新
            const left = 21 * index;
            return (
              <Cell 
                key={index} 
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
                height: '20px',
                borderTop: '1px solid #80808047',
                borderBottom: '1px solid #80808047'
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