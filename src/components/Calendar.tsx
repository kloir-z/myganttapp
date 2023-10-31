// Calendar.tsx
import React, { useEffect, useRef } from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { Row, Cell } from '../styles/GanttStyles';

interface CalendarProps {
  dateArray: Date[];
  setCalendarWidth: React.Dispatch<React.SetStateAction<number>>;
  wbsHeight: number;
  setColumnXPositions: React.Dispatch<React.SetStateAction<number[]>>
};

const Calendar: React.FC<CalendarProps> = ({ dateArray, setCalendarWidth, wbsHeight, setColumnXPositions }) => {
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const calculatedWidth = 21 * dateArray.length;
      setCalendarWidth(calculatedWidth);
  
      const newCellXPositions = columnRefs.current.map(cell => Math.ceil(cell?.offsetLeft ?? 0));
      setColumnXPositions(newCellXPositions);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dateArray.length]); 

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Row style={{ position: 'relative', borderTop: '1px solid gray' }}>
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
              ref={el => columnRefs.current[index] = el}
              $type={type}
              style={{
                position: 'absolute',
                left: `${left}px`,
                height: `${wbsHeight-23}px`
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