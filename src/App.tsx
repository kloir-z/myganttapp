// App.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import { ChartRow  } from './types/DataTypes';
import { GanttRow } from './styles/GanttStyles';
import "react-datepicker/dist/react-datepicker.css"; 
import './css/DatePicker.css'
import WBSInfo from './components/WBSInfo';
import GridHorizontal from './components/GridHorizontal';
import { useSelector } from 'react-redux';
import { RootState } from './reduxComponents/store';
import { generateDates } from './utils/CalendarUtil';
import GridVertical from './components/GridVertical';
import ResizeBar from './components/WbsWidthResizer';
import "./css/ReactGrid.css";
import "./css/HiddenScrollBar.css";

function App() {
  const data = useSelector((state: RootState) => state.wbsData);
  const [wbsWidth, setWbsWidth] = useState(550);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2023-09-01'),
    endDate: new Date('2025-10-05'),
  });
  const [dateArray, setDateArray] = useState(generateDates(dateRange.startDate, dateRange.endDate));
  const [isDragging, setIsDragging] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
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

  const handleResize = (newWidth: number) => {
    setWbsWidth(newWidth);
  };

  const calculateGridHeight = () => {
    const rowCount = Object.keys(data).length;
    const maxGridHeight = `calc(100vh - 41px)`;
    const dynamicGridHeight = `${rowCount * 21}px`;
  
    return rowCount * 21 < window.innerHeight - 41 ? dynamicGridHeight : maxGridHeight;
  };

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (canDrag && gridRef.current) {
      setIsDragging(true);
      setStartX(event.clientX + gridRef.current.scrollLeft);
      setStartY(event.clientY + gridRef.current.scrollTop);
    }
  }, [canDrag]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (canDrag && isDragging && gridRef.current) {
      gridRef.current.scrollLeft = startX - event.clientX;
      gridRef.current.scrollTop = startY - event.clientY;
    }
  }, [canDrag, isDragging, startX, startY]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('mousedown', handleMouseDown as any);
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        gridElement.removeEventListener('mousedown', handleMouseDown as any);
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div style={{position: 'fixed'}}>
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute', left: `${wbsWidth}px`, width: `calc(100vw - ${wbsWidth}px)`, height: '100vh', overflow: 'hidden'}} ref={calendarRef}>
        <Calendar
          dateArray={dateArray}
          setDateRange={setDateRange}
        />
        <GridVertical dateArray={dateArray} gridHeight={calculateGridHeight()} />
      </div>
      <div className="hiddenScrollbar" style={{position: 'absolute', top: '21px', width: `${wbsWidth}px`, height: `calc(100vh - 21px)`, overflowX: 'scroll' }} ref={wbsRef}>
        <WBSInfo />
      </div>
      <ResizeBar onDrag={handleResize} initialWidth={wbsWidth} />
      <div style={{position: 'absolute',top: '42px', left: `${wbsWidth}px`, width: `calc(100vw - ${wbsWidth}px)`, height: `calc(100vh - 41px)`, overflow: 'scroll'}} ref={gridRef}>
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
                  setCanDrag={setCanDrag}
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
                <GanttRow key={id} style={{ backgroundColor: '#ddedff', borderBottom: 'solid 1px #e8e8e8', width: `${calendarWidth}px`}}/>
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