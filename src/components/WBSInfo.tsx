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
                value={entry.displayName}
                onChange={(e) => updateField(index, 'displayName', e.target.value)}
                inputSize={entry.displayName.length}
              />
              <InputBox
                value={entry.majorCategory}
                onChange={(e) => updateField(index, 'majorCategory', e.target.value)}
                inputSize={entry.majorCategory.length}
              />
              {/* Add more fields similarly */}
            </Row>
          );
        } else if (entry.rowType === 'Separator') {
          return (
            <Row key={index} style={{ backgroundColor: '#ddedff' }}>
              {/* Separatorの詳細な内容をこちらに記述 */}
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
