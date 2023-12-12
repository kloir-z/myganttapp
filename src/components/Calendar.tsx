// Calendar.tsx
import React, { useState, useEffect, memo } from 'react';
import { isHoliday } from '../utils/CalendarUtil';
import { GanttRow, Cell } from '../styles/GanttStyles';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/DatePicker.css'

interface CalendarProps {
  dateArray: Date[];
  setDateRange: (range: { startDate: Date, endDate: Date }) => void;
};

const Calendar: React.FC<CalendarProps> = memo(({ dateArray, setDateRange }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date(dateArray[0]));
  const [endDate, setEndDate] = useState<Date | null>(new Date(dateArray[dateArray.length - 1]));
  let previousMonth = dateArray[0].getMonth();
  const calendarWidth = (dateArray.length * 21) + 21;

  useEffect(() => {
    if (startDate instanceof Date && endDate instanceof Date) {
      setDateRange({ startDate: startDate, endDate: endDate });
    }
  }, [startDate, endDate, setDateRange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: `${calendarWidth}px` }}>
      <ReactDatePicker
        showPopperArrow={false}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end)
        }}
        startDate={startDate}
        endDate={endDate}
        selectsRange
      >
      </ReactDatePicker>
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