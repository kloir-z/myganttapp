// WBSInfo.tsx
import React from 'react';
import { WBSData } from '../types/DataTypes';
import styled from 'styled-components';
import { Row } from '../styles/GridStyles';

export const InputBox = styled.input<{ inputSize: number }>`
  font-size: 0.8em;
  line-height: 16px;
  border: none;
  width: ${(props) => props.inputSize + "ch"}; /* ch units make the width character-based */
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
              <InputBox
                value={entry.plannedStartDate}
                onChange={(e) => updateField(index, 'plannedStartDate', e.target.value)}
                inputSize={entry.plannedStartDate.length}
              />
              <InputBox
                value={entry.plannedEndDate}
                onChange={(e) => updateField(index, 'plannedEndDate', e.target.value)}
                inputSize={entry.plannedEndDate.length}
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
