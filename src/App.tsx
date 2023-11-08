// App.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import { ChartRow  } from './types/DataTypes';
import { Row, InputBox } from './styles/GanttStyles';
import "react-datepicker/dist/react-datepicker.css"; 
import './css/DatePicker.css'
import ChartRowForWBSInfo from './components/ChartRowForWBSInfo';
import { useWBSData } from './context/WBSDataContext';
import { generateDates } from './utils/CalendarUtil';
import GridVertical from './components/GridVertical';

function App() {
  const { data } = useWBSData();
  const [wbsWidth, setWbsWidth] = useState(650);
  const [wbsHeight, setWbsHeight] = useState(data.length * 21);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  const divRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [dateRange, setDateRange] = useState({
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-11-05'),
  });
  const [dateArray, setDateArray] = useState(generateDates(dateRange.startDate, dateRange.endDate));
  const [initialStartDate, setInitialStartDate] = useState(dateRange.startDate);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const oneDayInMs = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const calendarWidth = windowWidth - 650;

  const calculateEndDate = (startDate: Date, calendarWidth: number) => {
    const dayWidth = 21;
    const displayableDays = Math.floor(calendarWidth / dayWidth);
    return new Date(startDate.getTime() + displayableDays * (1000 * 60 * 60 * 24));
  };
  
  useEffect(() => {
    const newEndDate = calculateEndDate(dateRange.startDate, calendarWidth);
    setDateRange((prevRange) => ({
      ...prevRange,
      endDate: newEndDate,
    }));
  }, [windowWidth, dateRange.startDate]);
  
  useEffect(() => {
    setDateArray(generateDates(dateRange.startDate, dateRange.endDate));
  }, [dateRange]);

  const updateField = async (index: number, field: string, value: any) => {
    const newData = [...data];
    (newData[index] as any)[field] = value;
  };

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        setWbsHeight(data.length * 21);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  //ここはuseCallbackを使用すると劇的にパフォーマンスが改善する。
  //Calendarのdivが横軸のチャートのdivの背面にあり、hoverが到達しないため以下の方法をとった。
  const handleMouseMove = useCallback((event: MouseEvent) => {
    // 既に適用されているhover-effectクラスを全て削除
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
  
    if (event.clientX < wbsWidth) {
      applyHoverEffectToTopElement((wbsWidth + 10), event.clientY);
    } else {
      applyHoverEffectToTopElement(event.clientX, event.clientY);
    }
    applyHoverEffectToTopElement(event.clientX, 30);
    applyHoverEffectToTopElement(30, event.clientY);
  }, []);

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

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(event.clientX);
    if (scrollRef.current) {
      (scrollRef.current as any).startY = event.clientY;
    }
    setInitialStartDate(dateRange.startDate);
  }, [setIsDragging, setDragStartX, dateRange.startDate]);

  const handleMouseDrag = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = event.clientX;
    const deltaX = currentX - dragStartX;
    const daysToAdjust = Math.round(deltaX / 21);
    const newStartDate = new Date(initialStartDate.getTime() - daysToAdjust * oneDayInMs);
    if (newStartDate.getTime() !== dateRange.startDate.getTime()) {
      setDateRange({ ...dateRange, startDate: newStartDate });
    }

    if (!scrollRef.current) return;
    const currentY = event.clientY;
    const deltaY = currentY - (scrollRef.current as any).startY;
    if (deltaY !== 0) {
      scrollRef.current.scrollTop -= deltaY;
      (scrollRef.current as any).startY = currentY;
    }

  }, [isDragging, dragStartX, initialStartDate, dateRange, setDateRange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);


  return (
    <div style={{position: 'relative'}}>
      <div ref={divRef}>
        <div style={{display: 'flex'}}>
          <div style={{minWidth: `${wbsWidth}px`}}>
            <Row style={{borderBottom: '1px solid transparent'}} />
            <Row />
          </div>
          <div style={{width: `${calendarWidth}px`, position: 'relative'}} >
            <Calendar dateArray={dateArray} />
            <GridVertical dateArray={dateArray} wbsHeight={wbsHeight} />
          </div>
        </div>
        <div ref={scrollRef}
             style={{position: 'absolute', top: '41px', overflowY: 'auto', overflowX: 'hidden', height: '96svh', width: '100svw'}}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseDrag}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
        >
          {data.map((entry, index) => {
            if (entry.rowType === 'Chart') {
              return (
                <ChartRowForWBSInfo
                  key={index}
                  entry={entry as ChartRow}
                  index={index}
                  dateArray={dateArray} 
                  wbsWidth={wbsWidth}
                />
              );
            } else if (entry.rowType === 'Separator') {
              return (
                <Row key={index} style={{ backgroundColor: '#ddedff', width: `${wbsWidth + calendarWidth}px`, zIndex: '2' }}>
                  <InputBox
                    style={{background: 'transparent'}}
                    value={entry.displayName}
                    onChange={(e) => updateField(index, 'displayName', e.target.value)}
                    $inputSize={entry.displayName.length}
                  />
                </Row>
              );
            } else if (entry.rowType === 'Event') {
              return (
                <Row key={index} style={{ width: `${wbsWidth + calendarWidth}px`, zIndex: '2' }}>
                  <InputBox
                    value={entry.displayName}
                    onChange={(e) => updateField(index, 'displayName', e.target.value)}
                    $inputSize={entry.displayName.length}
                  />
                </Row>
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