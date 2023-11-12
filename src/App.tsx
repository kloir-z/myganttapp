// App.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import { ChartRow  } from './types/DataTypes';
import { Row, InputBox } from './styles/GanttStyles';
import "react-datepicker/dist/react-datepicker.css"; 
import './css/DatePicker.css'
import WBSInfo from './components/WBSInfo';
import GridHorizontal from './components/GridHorizontal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, setData, setPlannedStartDate, setPlannedEndDate, setActualStartDate, setActualEndDate } from './reduxComponents/store';
import { generateDates } from './utils/CalendarUtil';
import GridVertical from './components/GridVertical';
import throttle from 'lodash/throttle';
import { scheduleEditSlice, startEditingActualDate, startEditingPlannedDate, stopEditingPlannedDate, stopEditingActualDate } from './reduxComponents/scheduleEditSlice';

function App() {
  const data = useSelector((state: RootState) => state.wbsData);
  const editingState = useSelector((state: RootState) => state.scheduleEdit);
  const dispatch = useDispatch<AppDispatch>();
  const [wbsWidth, setWbsWidth] = useState(350);
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

  const updateField = async (id: string, field: keyof ChartRow, value: any) => {
    const newData = { ...data };
    if (newData[id] && newData[id].rowType === 'Chart') {
      newData[id] = { ...newData[id], [field]: value };
      dispatch(setData(newData));
    }
  };

  //ここはuseCallbackを使用すると劇的にパフォーマンスが改善する。
  //Calendarのdivが横軸のチャートのdivの背面にあり、hoverが到達しないため以下の方法をとった。
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const lastDayColumnIndexRef1 = useRef<number | null>(null);
  const lastDayColumnIndexRef2 = useRef<number | null>(null);
  const lastWbsRowIndexRef1 = useRef<number | null>(null);
  const lastWbsRowIndexRef2 = useRef<number | null>(null);
  
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { clientX, clientY } = event;
    const newX = Math.floor(clientX / 21);
    const newY = Math.floor(clientY / 21);

    // document.querySelectorAll('.dayColumn.hover-effect, .wbsRow.hover-effect').forEach((element) => {
    //   element.classList.remove('hover-effect');
    // });
  
    const applyHoverEffectToTopElement = (x: number, y: number) => {
      const elements = document.elementsFromPoint(x, y);  
      const topMostDayColumn = elements.find((element) =>
        element instanceof HTMLElement && element.matches('.dayColumn')
      ) as HTMLElement | undefined;
  
      const topMostWbsRow = elements.find((element) =>
        element instanceof HTMLElement && element.matches('.wbsRow')
      ) as HTMLElement | undefined;

      if (topMostDayColumn) {
        const currentColumnIndex = topMostDayColumn.dataset.index ? parseInt(topMostDayColumn.dataset.index, 10) : null;
        if (lastDayColumnIndexRef1.current !== currentColumnIndex) {
          if (lastDayColumnIndexRef1.current !== null) {
            // 前回のhover-effectを削除
            document.querySelectorAll('.dayColumn.hover-effect').forEach((element) => {
              element.classList.remove('hover-effect');
            });
          }
          topMostDayColumn.classList.add('hover-effect');
          lastDayColumnIndexRef1.current = currentColumnIndex;
        }
        if (currentColumnIndex === null || currentColumnIndex < 0 || currentColumnIndex >= dateArray.length) {

        } else {

          const newDate = dateArray[currentColumnIndex].toISOString().substring(0, 10);

          if (editingState.isEditingActualDate && editingState.entryId) {
            dispatch(setActualEndDate({ id: editingState.entryId, endDate: newDate }));

          } else if (editingState.isEditingPlannedDate && editingState.entryId) {
            dispatch(setPlannedEndDate({ id: editingState.entryId, endDate: newDate }));
            
          }
        }
      }
  
      if (topMostWbsRow) {
        const currentRowIndex = topMostWbsRow.dataset.index ? parseInt(topMostWbsRow.dataset.index, 10) : null;
        if (lastWbsRowIndexRef1.current !== currentRowIndex) {
          if (lastWbsRowIndexRef1.current !== null) {
            // 前回のhover-effectを削除
            document.querySelectorAll('.wbsRow.hover-effect').forEach((element) => {
              element.classList.remove('hover-effect');
            });
          }
          topMostWbsRow.classList.add('hover-effect');
          lastWbsRowIndexRef1.current = currentRowIndex;
        }
      }
      
    };
    const applyHoverEffectToTopElement2 = (x: number, y: number) => {
      const elements = document.elementsFromPoint(x, y);  
      const topMostDayColumn = elements.find((element) =>
        element instanceof HTMLElement && element.matches('.dayColumn')
      ) as HTMLElement | undefined;

      if (topMostDayColumn) {
        const currentColumnIndex = topMostDayColumn.dataset.index ? parseInt(topMostDayColumn.dataset.index, 10) : null;
        topMostDayColumn.classList.add('hover-effect');
        lastDayColumnIndexRef2.current = currentColumnIndex;
      }
    };

    const applyHoverEffectToTopElement3 = (x: number, y: number) => {
      const elements = document.elementsFromPoint(x, y);  
      const topMostWbsRow = elements.find((element) =>
        element instanceof HTMLElement && element.matches('.wbsRow')
      ) as HTMLElement | undefined;

      if (topMostWbsRow) {
        const currentRowIndex = topMostWbsRow.dataset.index ? parseInt(topMostWbsRow.dataset.index, 10) : null;
        topMostWbsRow.classList.add('hover-effect');
        lastWbsRowIndexRef2.current = currentRowIndex;
      }
      
    };

    const xDirection = newX > lastMousePosition.current.x ? 4 : (newX < lastMousePosition.current.x ? -4 : 0);
    const yDirection = newY > lastMousePosition.current.y ? 4 : (newY < lastMousePosition.current.y ? -4 : 0);
  
    if ((clientX + xDirection) < wbsWidth) {
      applyHoverEffectToTopElement((wbsWidth + 10), (clientY + yDirection));
    } else {
      applyHoverEffectToTopElement((clientX + xDirection), (clientY + yDirection));
    }
    applyHoverEffectToTopElement2((clientX + xDirection), 30);
    applyHoverEffectToTopElement3(30, (clientY + yDirection));

    lastMousePosition.current = { x: newX, y: newY };
  }, [editingState]);

  const handleMouseUp = useCallback(() => {
    if (editingState.isEditingPlannedDate || editingState.isEditingActualDate) {
      dispatch(stopEditingPlannedDate());
      dispatch(stopEditingActualDate());
    }
  }, [editingState, lastDayColumnIndexRef1, lastWbsRowIndexRef1, lastDayColumnIndexRef2, lastWbsRowIndexRef2]); 

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'h' || event.key === 'l') {
      const moveDay = 1000 * 60 * 60 * 24 * 1;
      setDateRange(prevRange => {
        const newStartDate = new Date(
          event.key === 'h'
            ? prevRange.startDate.getTime() - moveDay
            : prevRange.startDate.getTime() + moveDay
        );
        const newEndDate = new Date(
          event.key === 'l'
            ? prevRange.endDate.getTime() + moveDay
            : prevRange.endDate.getTime() - moveDay
        );
        return {
          startDate: newStartDate,
          endDate: newEndDate,
        };
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

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
      <div style={{position: 'absolute', left: `${wbsWidth}px`, width: `calc(100vw - ${wbsWidth}px)`, height: '100vh', overflow: 'hidden'}} ref={calendarRef}>
        <Calendar dateArray={dateArray} />
        <GridVertical dateArray={dateArray} />
      </div>
      <div style={{position: 'absolute', top: '42px', width: `${wbsWidth}px`, height: `calc(100vh - 41px)`, overflowX: 'scroll', overflowY: 'hidden'}} ref={wbsRef}>
        {Object.entries(data).map(([id, entry], index) => {
          const topPosition = index * 21;
          if (entry.rowType === 'Chart') {
            return (
              <div
                key={id}
                style={{
                  position: 'absolute',
                  top: `${topPosition}px`,
                }}
              >
                <WBSInfo
                  entry={entry as ChartRow}
                  index={index}
                  wbsWidth={wbsWidth}
                />
              </div>
            );
          } else if (entry.rowType === 'Separator') {
            return (
              <div
                key={id}
                style={{
                  backgroundColor: '#ddedff',
                  width: `${wbsWidth}px`,
                  position: 'absolute',
                  top: `${topPosition}px`,
                }}
              >
                <Row key={id} style={{ backgroundColor: '#ddedff', width: `${wbsWidth}px`}}>
                  <InputBox
                    style={{background: 'transparent'}}
                    value={entry.displayName}
                    onChange={(e) => updateField(id, 'displayName', e.target.value)}
                    $inputSize={entry.displayName.length}
                  />
                </Row>
              </div>
            );
          } else if (entry.rowType === 'Event') {
            return (
              <div
                key={id}
                style={{
                  width: `${wbsWidth}px`,
                  position: 'absolute',
                  top: `${topPosition}px`,
                }}
              >
                <Row key={index} style={{ width: `${wbsWidth}px`}}>
                  <InputBox
                    value={entry.displayName}
                    onChange={(e) => updateField(id, 'displayName', e.target.value)}
                    $inputSize={entry.displayName.length}
                  />
                </Row>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div style={{position: 'absolute',top: '42px', left: `${wbsWidth}px`, width: `calc(100vw - ${wbsWidth}px)`, height: `calc(100vh - 41px)`, overflow: 'scroll'}} ref={gridRef}>
        {Object.entries(data).map(([id, entry], index) => {
          const topPosition = index * 21;
          if (entry.rowType === 'Chart') {
            return (
              <div
                key={id}
                style={{
                  position: 'absolute',
                  top: `${topPosition}px`
                }}
              >
                <GridHorizontal
                  entry={entry as ChartRow}
                  index={index}
                  dateArray={dateArray}
                  wbsWidth={wbsWidth}
                  gridRef={gridRef}
                />
              </div>
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
                <Row key={id} style={{ backgroundColor: '#ddedff', width: `${calendarWidth}px`}}/>
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
                <Row key={index} style={{ width: `${calendarWidth}px`}}>
                </Row>
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