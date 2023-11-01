//GridStyles.ts
import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  height: 20px;
  border-bottom: solid 1px #80808047;
  position: relative;
  user-select: none;
  &:hover {
    border-bottom: solid 1px #001aff83;
  }
`;

interface CellProps {
  $type?: string;
  $isPlanned?: boolean;
  $isActual?: boolean;
  $charge?: string;
  $width?: number;
}

export const Cell = styled.div<CellProps>`
  font-size: 0.8rem;
  text-align: center;
  position: relative;
  width: ${props => (props.$width ? `${props.$width}px` : '21px')};
  height: 20px;
  border-left: 1px solid ${props => (props.$isPlanned ? 'transparent' : '#80808047')};
  background-color: ${props => {
    let baseColor = 'transparent';
    if (props.$type === 'saturday') return '#cddeff';
    if (props.$type === 'sundayOrHoliday') return '#ffcaca';
    if (props.$isPlanned) {
      baseColor = props.$charge === 'vendor' ? '#74ff7451' : '#b05cff4d';
    }
    return baseColor;
  }};
`;

export const DisplayLabel = styled.label<CellProps>`
  position: absolute;
  z-index: 1;
  left: 0px;
  background: none;
  border: solid 1px transparent;
  overflow: visible;
  white-space: nowrap;
  top: 0px;
  font-size: 0.8rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  &:focus {
    outline: none;
    border: solid 1px #007bff;
  }
`;

export const InputBox = styled.input<{ $inputSize?: number }>`
  font-size: 0.8em;
  line-height: 16px;
  border: solid 1px transparent;
  width: ${(props) => props.$inputSize ? props.$inputSize + "ch" : "20px"};
  min-width: ${(props) => props.$inputSize ? "80px" : "0"};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  &:focus {
    outline: none;
    border: solid 1px #007bff;
  }
`;