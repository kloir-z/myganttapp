// App.tsx
import styled from 'styled-components';
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
import { relative } from 'path';

function App() {
  const { data } = useWBSData();
  const [wbsWidth, setWbsWidth] = useState(650);
  const [wbsHeight, setWbsHeight] = useState(data.length * 21);

  const divRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-11-05'),
  });
  const [dateArray, setDateArray] = useState(generateDates(dateRange.startDate, dateRange.endDate));
  const calendarWidth = dateArray.length * 21;
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
  
    applyHoverEffectToTopElement(event.clientX, 60);
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
    if (event.key === 'j' || event.key === 'k') {
      // 1か月をミリ秒で
      const oneMonth = 1000 * 60 * 60 * 24 * 3;
      setDateRange(prevRange => {
        const newStartDate = new Date(
          event.key === 'j'
            ? prevRange.startDate.getTime() - oneMonth
            : prevRange.startDate.getTime() + oneMonth
        );
        const newEndDate = new Date(
          event.key === 'k'
            ? prevRange.endDate.getTime() + oneMonth
            : prevRange.endDate.getTime() - oneMonth
        );
        return {
          startDate: newStartDate,
          endDate: newEndDate,
        };
      });
    }
  }, []);

  useEffect(() => {
    setDateArray(generateDates(dateRange.startDate, dateRange.endDate));
  }, [dateRange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div style={{position: 'relative'}}>
      <div ref={divRef}>
        <div style={{display: 'flex'}}>
          <div style={{minWidth: `${wbsWidth}px`}}>
            <Row style={{borderBottom: '1px solid transparent'}} />
            <Row />
          </div>
          <div style={{width: `${calendarWidth}px`, position: 'relative'}}>
            <Calendar dateArray={dateArray} />
            <GridVertical dateArray={dateArray} wbsHeight={wbsHeight} />
          </div>
        </div>
        <div style={{position: 'absolute', top: '41px'}}>
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