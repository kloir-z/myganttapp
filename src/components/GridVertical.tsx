// GridVertial.tsx
import React from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { Row, Cell } from '../styles/GanttStyles';

interface CalendarProps {
  dateArray: Date[];
};

const GridVertical: React.FC<CalendarProps> = ({ dateArray }) => {

  return (
    <Row>
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
              top: '0px',
              left: `${left}px`,
              height: `calc(100vh - 41px)`,
              borderTop: '1px solid #80808047'
            }}
          />
        );
      })}
    </Row>
  );
};

export default GridVertical;