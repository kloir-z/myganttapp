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

const FlexContainer = styled.div`
  display: flex;
`;

const WBSFixed = styled.div`
  /* WBS固定部分のスタイリング */
`;

const GanttFixed = styled.div`
  /* カレンダー固定部分のスタイリング */
`;

function App() {
  const [wbsWidth, setWbsWidth] = useState(650);
  const [wbsHeight, setWbsHeight] = useState(0);

  const divRef = useRef<HTMLDivElement>(null);
  const { data } = useWBSData();
  const dateRange = {
    startDate: new Date('2023-09-01'),
    endDate: new Date('2026-04-05')
  };
  const dateArray = generateDates(dateRange.startDate, dateRange.endDate);
  const calendarWidth = dateArray.length * 21;
  const updateField = async (index: number, field: string, value: any) => {
    const newData = [...data];
    (newData[index] as any)[field] = value;
  };

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        setWbsHeight(divRef.current.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //ここはuseCallbackを使用すると劇的にパフォーマンスが改善する。
  //Calendarのdivが横軸のチャートのdivの背面にあり、hoverが到達しないため以下の方法をとった。
  const handleMouseMove = useCallback((event: MouseEvent) => {
    document.querySelectorAll('.dayColumn.hover-effect').forEach((element) => {
      element.classList.remove('hover-effect');
    });
  
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const topMostDayColumn = elements.find((element) => 
      element instanceof HTMLElement && element.matches('.dayColumn')
    );
    
    if (topMostDayColumn) {
      topMostDayColumn.classList.add('hover-effect');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);
  

  return (
    <>
      <FlexContainer>
        <WBSFixed>
          <div ref={divRef} style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div style={{display: 'flex', width: `${wbsWidth}px`}}>
                <Row style={{borderTop: '1px solid gray', borderBottom: '1px solid transparent'}}></Row>
                <Row></Row>
              </div>
              <Calendar
                dateArray={dateArray}
                wbsHeight={wbsHeight}
              />
            </div>
            <div>
              <div style={{display: 'flex'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  {data.map((entry, index) => {
                    if (entry.rowType === 'Chart') {
                      return (
                        <ChartRowForWBSInfo
                          key={index}
                          entry={entry as ChartRow}
                          index={index}
                          dateArray={dateArray} 
                          dateRange={dateRange}
                          rowWidth={wbsWidth + calendarWidth}
                          wbsHeight={wbsHeight}
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
          </div>
        </WBSFixed>
      </FlexContainer>
    </>
  );
}

export default App;