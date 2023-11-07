// Calendar.tsx
import React from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { Row, Cell } from '../styles/GanttStyles';

interface CalendarProps {
  dateArray: Date[];
  wbsHeight: number;
};

const GridVertical: React.FC<CalendarProps> = ({ dateArray, wbsHeight }) => {

  return (
    <Row style={{ position: 'relative', height: '0px' }}>
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
              top: '41px',
              left: `${left}px`,
              height: `${wbsHeight}px`,
              borderTop: '1px solid #80808047'
            }}
          />
        );
      })}
    </Row>
  );
};

export default GridVertical;