//GridStyles.ts
import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  height: 20px;
  border-bottom: solid 1px gray;
`;

export const Cell = styled.div<{ type?: string }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-left: 1px solid gray;
  text-align: center;
  font-size: 0.8rem;
  background-color: ${props => {
    if (props.type === 'saturday') return '#cddeff';
    if (props.type === 'sundayOrHoliday') return '#ffcaca';
    if (props.type === 'task') return '#a1ffa4';
    if (props.type === 'event') return '#a1ffa4';
  }};
`;