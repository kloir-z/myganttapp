// App.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import { WBSData, ChartRow  } from './types/DataTypes';
import { GanttRow, InputBox } from './styles/GanttStyles';
import "react-datepicker/dist/react-datepicker.css"; 
import './css/DatePicker.css'
import WBSInfo from './components/WBSInfo';
import GridHorizontal from './components/GridHorizontal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, setData, setPlannedStartDate, setPlannedEndDate, setActualStartDate, setActualEndDate } from './reduxComponents/store';
import { generateDates } from './utils/CalendarUtil';
import GridVertical from './components/GridVertical';
import { setHoveredDayColumnIndex, setHoveredWbsRowIndex } from './reduxComponents/hoverSlice';

type EditingInfo = {
  id: string | null;
  mode: 'planned' | 'actual' | null;
};

function App() {
  const data = useSelector((state: RootState) => state.wbsData);
  const [editingChartRow, setEditingChartRow] = useState<EditingInfo>({ id: null, mode: null });
  const dispatch = useDispatch<AppDispatch>();
  const [wbsWidth, setWbsWidth] = useState(350);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-10-05'),
  });
  const [dateArray, setDateArray] = useState(generateDates(dateRange.startDate, dateRange.endDate));
  const hoveredRowIndex = useSelector((state: RootState) => state.hover.hoveredWbsRowIndex);

  const wbsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const calendarWidth = dateArray.length * 21;
  
  useEffect(() => {
    setDateArray(generateDates(dateRange.startDate, dateRange.endDate));
  }, [dateRange]);

  const updateField = async (id: string, field: keyof ChartRow, value: any) => {
    const newData = { ...data };
    if (newData[id] && newData[id].rowType === 'Chart') {
      newData[id] = { ...newData[id], [field]: value };
      dispatch(setData(newData));
    }
  };

  const lastMousePosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (gridRef.current) {
      const gridOffset = gridRef.current.getBoundingClientRect();
      const scrollLeft = gridRef.current.scrollLeft;
      const scrollTop = gridRef.current.scrollTop;
  
      const relativeX = event.clientX - gridOffset.left + scrollLeft;
      const relativeY = event.clientY - gridOffset.top + scrollTop;
  
      const newX = Math.floor(relativeX / 21);
      const newY = Math.floor(relativeY / 21);
  
      if (lastMousePosition.current.x !== newX || lastMousePosition.current.y !== newY) {
        dispatch(setHoveredDayColumnIndex(newX));
        dispatch(setHoveredWbsRowIndex(newY));
        lastMousePosition.current = { x: newX, y: newY };
      }
      if (editingChartRow.id) {
        if (editingChartRow.mode === 'planned') {
          const newDate = dateArray[newX].toISOString().substring(0, 10);
          dispatch(setPlannedEndDate({ id: editingChartRow.id, endDate: newDate }));
        } else if (editingChartRow.mode === 'actual') {
          const newDate = dateArray[newX].toISOString().substring(0, 10);
          dispatch(setActualEndDate({ id: editingChartRow.id, endDate: newDate }));
        }
      }
    }
  }, [dispatch, editingChartRow]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (gridRef.current) {
      const gridOffset = gridRef.current.getBoundingClientRect();
      const scrollLeft = gridRef.current.scrollLeft;
      const scrollTop = gridRef.current.scrollTop;
  
      const relativeX = event.clientX - gridOffset.left + scrollLeft;
      const relativeY = event.clientY - gridOffset.top + scrollTop;
  
      const newX = Math.floor(relativeX / 21);
      const newY = Math.floor(relativeY / 21);
  
      const rowIds = Object.keys(data);
      const chartRowId = newY < rowIds.length ? rowIds[newY] : null;
      const newDate = dateArray[newX].toISOString().substring(0, 10);
    
      if (chartRowId) {
        if (event.shiftKey) {
          dispatch(setActualStartDate({ id: chartRowId, startDate: newDate }));
          dispatch(setActualEndDate({ id: chartRowId, endDate: newDate }));
          setEditingChartRow({ id: chartRowId, mode: 'actual' });
        } else {
          dispatch(setPlannedStartDate({ id: chartRowId, startDate: newDate }));
          dispatch(setPlannedEndDate({ id: chartRowId, endDate: newDate }));
          setEditingChartRow({ id: chartRowId, mode: 'planned' });
        }
      }
    }
  }, [data, setEditingChartRow]);

  useEffect(() => {
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('dblclick', handleDoubleClick);
      return () => {
        gridElement.removeEventListener('dblclick', handleDoubleClick);
      };
    }
  }, [handleDoubleClick]);  

  const handleGridClick = useCallback(() => {
    if (editingChartRow && editingChartRow.id) {
      setEditingChartRow({ id: null, mode: null });
    }
  }, [editingChartRow, setEditingChartRow]);
  
  useEffect(() => {
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('click', handleGridClick);
      return () => {
        gridElement.removeEventListener('click', handleGridClick);
      };
    }
  }, [handleGridClick]);

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
      <div style={{position: 'absolute',top: '42px', left: `${wbsWidth}px`, width: `calc(100vw - 30px - ${wbsWidth}px)`, height: `calc(100vh - 41px)`, overflow: 'scroll'}} ref={gridRef}>
        {Object.entries(data).map(([id, entry], index) => {
          const topPosition = index * 21;
          const isHovered = index === hoveredRowIndex;
          if (entry.rowType === 'Chart') {
            return (
              <GanttRow
                key={id}
                style={{
                  position: 'absolute',
                  top: `${topPosition}px`,
                  width: `${calendarWidth}px`
                }}
                className={`wbsRow ${isHovered ? 'hover-effect' : ''}`}
              >
                <GridHorizontal
                  entry={entry as ChartRow}
                  index={index}
                  dateArray={dateArray}
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