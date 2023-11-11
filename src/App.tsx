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
import { RootState, AppDispatch, setData } from './reduxComponents/store';
import { generateDates } from './utils/CalendarUtil';
import GridVertical from './components/GridVertical';
import throttle from 'lodash/throttle';

function App() {
  const data = useSelector((state: RootState) => state.wbsData);
  const dispatch = useDispatch<AppDispatch>();
  const [wbsWidth, setWbsWidth] = useState(650);
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

  const handleMouseMove = useCallback(throttle((event: MouseEvent) => {
    const { clientX, clientY } = event;
    const newX = Math.floor(clientX / 21);
    const newY = Math.floor(clientY / 21);

    document.querySelectorAll('.dayColumn.hover-effect, .wbsRow.hover-effect').forEach((element) => {
      element.classList.remove('hover-effect');
    });
  
    const applyHoverEffectToTopElement = (x: number, y: number) => {
      const elements = document.elementsFromPoint(x, y);  
      const topMostDayColumn = elements.find((element) =>
        element instanceof HTMLElement && element.matches('.dayColumn')
      ) as HTMLElement | undefined;
  
      const topMostWbsRow = elements.find((element) =>
        element instanceof HTMLElement && element.matches('.wbsRow')
      ) as HTMLElement | undefined;
  
      if (topMostDayColumn) {
        topMostDayColumn.classList.add('hover-effect');
      }
  
      if (topMostWbsRow) {
        topMostWbsRow.classList.add('hover-effect');
      }
    };

    const xDirection = newX > lastMousePosition.current.x ? 4 : (newX < lastMousePosition.current.x ? -4 : 0);
    const yDirection = newY > lastMousePosition.current.y ? 4 : (newY < lastMousePosition.current.y ? -4 : 0);
  
    if ((clientX + xDirection) < wbsWidth) {
      applyHoverEffectToTopElement((wbsWidth + 10), (clientY + yDirection));
    } else {
      applyHoverEffectToTopElement((clientX + xDirection), (clientY + yDirection));
    }
    applyHoverEffectToTopElement((clientX + xDirection), 30);
    applyHoverEffectToTopElement(30, (clientY + yDirection));

    lastMousePosition.current = { x: newX, y: newY };
  }, 30), []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);
  
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
  
    // WBSとグリッドのY軸スクロール同期
    if (wbsElement && gridElement) {
      wbsElement.addEventListener('scroll', () => handleVerticalScroll(wbsRef, gridRef));
      gridElement.addEventListener('scroll', () => handleVerticalScroll(gridRef, wbsRef));
    }
  
    // カレンダーとグリッドのX軸スクロール同期
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
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute', left: `${wbsWidth}px`, width: `calc(100vw - ${wbsWidth}px)`, height: '100vh', overflow: 'hidden'}} ref={calendarRef}>
        <Calendar dateArray={dateArray} />
        <GridVertical dateArray={dateArray} />
      </div>
      <div style={{position: 'absolute', top: '41px', width: `${wbsWidth}px`, height: `calc(100vh - 41px)`, overflow: 'hidden'}} ref={wbsRef}>
        {Object.entries(data).map(([id, entry], index) => {
          const topPosition = index * 21;
          if (entry.rowType === 'Chart') {
            return (
              <div
                key={id}
                style={{
                  display: 'flex',
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
                  width: `${calendarWidth}px`,
                  position: 'absolute',
                  top: `${topPosition}px`, // ここで縦位置を設定
                }}
              >
                <Row key={id} style={{ backgroundColor: '#ddedff', width: `${calendarWidth}px`}}>
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
                  width: `${calendarWidth}px`,
                  position: 'absolute',
                  top: `${topPosition}px`, // ここで縦位置を設定
                }}
              >
                <Row key={index} style={{ width: `${calendarWidth}px`}}>
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
      <div style={{position: 'absolute',top: '41px', left: `${wbsWidth}px`, width: `calc(100vw - ${wbsWidth}px)`, height: `calc(100vh - 41px)`, overflow: 'scroll'}} ref={gridRef}>
      {Object.entries(data).map(([id, entry], index) => {
        const topPosition = index * 21;
        if (entry.rowType === 'Chart') {
          return (
            <div
              key={id}
              style={{
                display: 'flex',
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
                top: `${topPosition}px`, // ここで縦位置を設定
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
                top: `${topPosition}px`, // ここで縦位置を設定
              }}
            >
              <Row key={index} style={{ width: `${calendarWidth}px`}}>
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
    </div>
  );
}

export default App;