// GridVertial.tsx
import React, { memo } from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { Row, Cell } from '../styles/GanttStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxComponents/store';

interface CalendarProps {
  dateArray: Date[];
};

const GridVertical: React.FC<CalendarProps> = memo(({ dateArray }) => {
  const hoveredColumnIndex = useSelector((state: RootState) => state.hover.hoveredDayColumnIndex);

  return (
    <Row style={{height: '0px', borderBottom: 'none'}}>
      {dateArray.map((date, index) => {
        let type = 'weekday';

        if (date.getDay() === 6) type = 'saturday';
        if (date.getDay() === 0 || isHoliday(date)) type = 'sundayOrHoliday';
        const left = 21 * index;
        const isHovered = index === hoveredColumnIndex;

        return (
          <Cell
            key={index}
            data-index={index}
            $type={type}
            className={`dayColumn ${isHovered ? 'hover-effect' : ''}`}
            style={{
              position: 'absolute',
              top: '0px',
              left: `${left}px`,
              height: `calc(100vh - 41px)`,
            }}
          />
        );
      })}
    </Row>
  );
});

export default memo(GridVertical);