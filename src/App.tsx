// App.tsx
import WBSInfo from './components/WBSInfo';
import styled from 'styled-components';
import { WBSDataProvider } from './context/WBSDataContext';

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
  const dateRange = {
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-04-05')
  };

  return (
    <WBSDataProvider>
      <FlexContainer>
        <WBSFixed>
          <WBSInfo dateRange={dateRange} />
        </WBSFixed>
      </FlexContainer>
    </WBSDataProvider>
  );
}

export default App;