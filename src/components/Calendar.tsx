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
      <Row style={{borderTop: '1px solid gray'}}>
        {dateArray.map((date, index) => (
          date.getDate() === 1 ? (
            <Cell key={index}>
              {date.getFullYear()}/{String(date.getMonth() + 1).padStart(2, '0')}
            </Cell>
          ) : (
            <Cell key={index} style={{borderLeft: '1px solid transparent',background: 'transparent'}} />
          )
        ))}
      </Row>
      <Row>
      {dateArray.map((date, index) => {
        let type = 'weekday';
        if (date.getDay() === 6) type = 'saturday';
        if (date.getDay() === 0 || isHoliday(date)) type = 'sundayOrHoliday';

        return (
          <Cell key={index} $type={type}>
            {date.getDate()}
          </Cell>
        );
      })}
      </Row>
    </div>
  );
};

export default Calendar;