// WBSInfo.tsx
import React, {useState} from 'react';
import { WBSData } from '../types/DataTypes';
import styled from 'styled-components';
import { Row } from '../styles/GanttStyles';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import '../css/DatePicker.css'

export const InputBox = styled.input<{ inputSize: number }>`
  font-size: 0.8em;
  line-height: 16px;
  border: solid 1px transparent;
  width: ${(props) => props.inputSize + "ch"}; /* ch units make the width character-based */
  min-width: 80px;
  &:focus {
    outline: none;
    border: solid 1px #007bff;
  }
`;

interface WBSInfoProps {
  data: WBSData[];
  setData: React.Dispatch<React.SetStateAction<WBSData[]>>;
};

const WBSInfo: React.FC<WBSInfoProps> = ({ data, setData }) => {
  const updateField = (index: number, field: string, value: any) => {
    const newData = [...data];
    (newData[index] as any)[field] = value;
    setData(newData);
  };

  const updateDate = (index: number, fieldStart: string, fieldEnd: string, startDate: Date | null, endDate: Date | null) => {
    updateField(index, fieldStart, startDate ? startDate.toISOString() : null);
    updateField(index, fieldEnd, endDate ? endDate.toISOString() : null);
  };

  return (
    <>
      <Row style={{borderTop: '1px solid gray', borderBottom: '1px solid transparent'}}></Row>
      <Row></Row>
      {data.map((entry, index) => {
        if (entry.rowType === 'Chart') {
          return (
            <Row key={index}>
              <InputBox
                value={entry.majorCategory}
                onChange={(e) => updateField(index, 'majorCategory', e.target.value)}
                inputSize={entry.majorCategory.length}
              />
              <InputBox
                value={entry.middleCategory}
                onChange={(e) => updateField(index, 'middleCategory', e.target.value)}
                inputSize={entry.middleCategory.length}
              />
              <InputBox
                value={entry.subCategory}
                onChange={(e) => updateField(index, 'subCategory', e.target.value)}
                inputSize={entry.subCategory.length}
              />
              <InputBox
                value={entry.task}
                onChange={(e) => updateField(index, 'task', e.target.value)}
                inputSize={entry.task.length}
              />
              <DatePicker
                wrapperClassName="datePicker"
                dateFormat="M/d"
                selectsRange={true}
                startDate={entry.plannedStartDate ? new Date(entry.plannedStartDate) : null}
                endDate={entry.plannedEndDate ? new Date(entry.plannedEndDate) : null}
                onChange={(update: [Date | null, Date | null]) => {
                  updateDate(index, 'plannedStartDate', 'plannedEndDate', update[0], update[1]);
                }}
                isClearable={false}
              />
              <InputBox
                value={entry.estimatedDaysRequired}
                onChange={(e) => updateField(index, 'estimatedDaysRequired', e.target.value)}
                inputSize={3}
              />
              <DatePicker
                wrapperClassName="datePicker"
                dateFormat="M/d"
                selectsRange={true}
                startDate={entry.actualStartDate ? new Date(entry.actualStartDate) : null}
                endDate={entry.actualEndDate ? new Date(entry.actualEndDate) : null}
                onChange={(update: [Date | null, Date | null]) => {
                  updateDate(index, 'actualStartDate', 'actualEndDate', update[0], update[1]);
                }}
                isClearable={false}
              />
            </Row>
          );
        } else if (entry.rowType === 'Separator') {
          return (
            <Row key={index} style={{ backgroundColor: '#ddedff' }}>
              <InputBox
                style={{background: 'transparent'}}
                value={entry.displayName}
                onChange={(e) => updateField(index, 'displayName', e.target.value)}
                inputSize={entry.displayName.length}
              />
            </Row>
          );
        } else if (entry.rowType === 'Event') {
          return (
            <Row key={index}>
              <InputBox
                value={entry.displayName}
                onChange={(e) => updateField(index, 'displayName', e.target.value)}
                inputSize={entry.displayName.length}
              />
            </Row>
          );
        }
        return null;
      })}
    </>
  );
};

export default WBSInfo;
