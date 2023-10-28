// App.tsx
import React, { useState } from 'react';
import GanttGrid from './components/GanttGrid';
import WBSInfo from './components/WBSInfo';
import { WBSData } from './types/DataTypes';
import styled from 'styled-components';
import { testData } from './testdata/testdata';

const FlexContainer = styled.div`
  display: flex;
`;

const WBSFixed = styled.div`
  /* WBS固定部分のスタイリング */
`;

const CalendarFixed = styled.div`
  /* カレンダー固定部分のスタイリング */
`;

function App() {
  const [data, setData] = useState<WBSData[]>(testData);
  const dateRange = {
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-02-29')
  };

  return (
    <>
      <FlexContainer>
        <WBSFixed>
          <WBSInfo data={data} setData={setData} />
        </WBSFixed>
        <CalendarFixed>
          <GanttGrid data={data} setData={setData} dateRange={dateRange} />
        </CalendarFixed>
      </FlexContainer>
    </>
  );
}

export default App;