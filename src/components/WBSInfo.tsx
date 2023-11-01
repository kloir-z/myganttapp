// WBSInfo.tsx
import React, { useState, useRef, useEffect } from 'react';
import Calendar from './Calendar';
import { ChartRow  } from '../types/DataTypes';
import { Row, InputBox } from '../styles/GanttStyles';
import "react-datepicker/dist/react-datepicker.css"; 
import '../css/DatePicker.css'
import ChartRowForWBSInfo from './ChartRowForWBSInfo';
import { useWBSData } from '../context/WBSDataContext';
import { generateDates } from '../utils/CalendarUtil';

interface GanttGridProps {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  wbsWidth: number;
}

const WBSInfo: React.FC<GanttGridProps> = ({ dateRange, wbsWidth }) => {
  const [wbsHeight, setWbsHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const { data } = useWBSData();
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

  return (
    <>
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
    </>
  );
};

export default WBSInfo;