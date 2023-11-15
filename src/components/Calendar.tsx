// Calendar.tsx
import React, {useState, memo, useEffect} from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { GanttRow, Cell } from '../styles/GanttStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxComponents/store';

interface CalendarProps {
  dateArray: Date[];
};

const Calendar: React.FC<CalendarProps> = memo(({ dateArray }) => {
  let previousMonth = dateArray[0].getMonth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const hoveredColumnIndex = useSelector((state: RootState) => state.hover.hoveredDayColumnIndex);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
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
          const isHovered = index === hoveredColumnIndex;

          return (
            <Cell
              key={index}
              data-index={index}
              $type={type}
              className={`dayColumn ${isHovered ? 'hover-effect' : ''}`}
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