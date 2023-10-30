// WBSInfo.tsx
import React from 'react';
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
}

const WBSInfo: React.FC<GanttGridProps> = ({ dateRange }) => {
  const { data } = useWBSData();
  const dateArray = generateDates(dateRange.startDate, dateRange.endDate);
  const updateField = async (index: number, field: string, value: any) => {
    const newData = [...data];
    (newData[index] as any)[field] = value;
  };

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div style={{display: 'flex', width: '650px'}}>
            <Row style={{borderTop: '1px solid gray', borderBottom: '1px solid transparent'}}></Row>
            <Row></Row>
          </div>
          <Calendar dateArray={dateArray} />
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
                    />
                  );
                } else if (entry.rowType === 'Separator') {
                  return (
                    <Row key={index} style={{ backgroundColor: '#ddedff' }}>
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
                    <Row key={index}>
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