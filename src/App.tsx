// App.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import { ChartRow  } from './types/DataTypes';
import { GanttRow } from './styles/GanttStyles';
import "react-datepicker/dist/react-datepicker.css"; 
import './css/DatePicker.css'
import WBSInfo from './components/WBSInfo';
import GridHorizontal from './components/GridHorizontal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './reduxComponents/store';
import { generateDates } from './utils/CalendarUtil';
import GridVertical from './components/GridVertical';
import ResizeBar from './components/WbsWidthResizer';

function App() {
  const data = useSelector((state: RootState) => state.wbsData);
  const [wbsWidth, setWbsWidth] = useState(550);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-10-05'),
  });
  const [dateArray, setDateArray] = useState(generateDates(dateRange.startDate, dateRange.endDate));
  const wbsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const calendarWidth = dateArray.length * 21;
  
  useEffect(() => {
    setDateArray(generateDates(dateRange.startDate, dateRange.endDate));
  }, [dateRange]);
  
  useEffect(() => {
    const handleVerticalScroll = (sourceRef: React.RefObject<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement>) => {
      if (sourceRef.current && targetRef.current) {
        targetRef.current.scrollTop = sourceRef.current.scrollTop;
      }
    };
  
    const handleHorizontalScroll = (sourceRef: React.RefObject<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement>) => {
      if (sourceRef.current && targetRef.current) {
        targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
      }
    };
  
    const wbsElement = wbsRef.current;
    const calendarElement = calendarRef.current;
    const gridElement = gridRef.current;
  
    if (wbsElement && gridElement) {
      wbsElement.addEventListener('scroll', () => handleVerticalScroll(wbsRef, gridRef));
      gridElement.addEventListener('scroll', () => handleVerticalScroll(gridRef, wbsRef));
    }
  
    if (calendarElement && gridElement) {
      calendarElement.addEventListener('scroll', () => handleHorizontalScroll(calendarRef, gridRef));
      gridElement.addEventListener('scroll', () => handleHorizontalScroll(gridRef, calendarRef));
    }
  
    return () => {
      if (wbsElement && gridElement) {
        wbsElement.removeEventListener('scroll', () => handleVerticalScroll(wbsRef, gridRef));
        gridElement.removeEventListener('scroll', () => handleVerticalScroll(gridRef, wbsRef));
      }
      if (calendarElement && gridElement) {
        calendarElement.removeEventListener('scroll', () => handleHorizontalScroll(calendarRef, gridRef));
        gridElement.removeEventListener('scroll', () => handleHorizontalScroll(gridRef, calendarRef));
      }
    };
  }, []);

// In the App component
const handleResize = (newWidth: number) => {
  setWbsWidth(newWidth);
};


  return (
    
    <div style={{position: 'fixed', left: '30px'}}>
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute', left: `${wbsWidth}px`, width: `calc(100vw - 30px - ${wbsWidth}px)`, height: '100vh', overflow: 'hidden'}} ref={calendarRef}>
        <Calendar dateArray={dateArray} />
        <GridVertical dateArray={dateArray} />
      </div>
      <div style={{position: 'absolute', top: '21px', width: `${wbsWidth}px`, height: `calc(100vh - 21px)`, overflowX: 'scroll', overflowY: 'hidden'}} ref={wbsRef}>
        <WBSInfo />
      </div>
      <ResizeBar onDrag={handleResize} initialWidth={wbsWidth} />
      <div style={{position: 'absolute',top: '42px', left: `${wbsWidth}px`, width: `calc(100vw - 30px - ${wbsWidth}px)`, height: `calc(100vh - 41px)`, overflow: 'scroll'}} ref={gridRef}>
        {Object.entries(data).map(([id, entry], index) => {
          const topPosition = index * 21;
          if (entry.rowType === 'Chart') {
            return (
              <GanttRow
                key={id}
                style={{
                  position: 'absolute',
                  top: `${topPosition}px`,
                  width: `${calendarWidth}px`
                }}
              >
                <GridHorizontal
                  entry={entry as ChartRow}
                  dateArray={dateArray}
                  gridRef={gridRef}
                />
              </GanttRow>
            );
          } else if (entry.rowType === 'Separator') {
            return (
              <div
                key={id}
                style={{
                  backgroundColor: '#ddedff',
                  position: 'absolute',
                  top: `${topPosition}px`,
                }}
              >
                <GanttRow key={id} style={{ backgroundColor: '#ddedff', width: `${calendarWidth}px`}}/>
              </div>
            );
          } else if (entry.rowType === 'Event') {
            return (
              <div
                key={id}
                style={{
                  position: 'absolute',
                  top: `${topPosition}px`,
                }}
              >
                <GanttRow key={index} style={{ width: `${calendarWidth}px`}}>
                </GanttRow>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
    </div>
  );
}

export default App;