//GridStyles.ts
import styled from 'styled-components';
import { ChartBarColor } from '../types/ChartTypes';

export const GanttRow = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 21px;
  background: none;
  border-bottom: solid 1px #00000016;
  position: relative;
  user-select: none;
  align-items: center;
`;

interface CellProps {
  $type?: string;
  $isPlanned?: boolean;
  $isActual?: boolean;
  $charge?: string;
  $chartBarColor?: ChartBarColor;
  $width?: number;
}

const getColorCode = (colorName: ChartBarColor) => {
  switch (colorName) {
    case 'lightblue':
      return '#70ecff51';
    case 'blue':
      return '#70b0ff51';
    case 'purple':
      return '#8a70ff51';
    case 'pink':
      return '#ff70ea51';
    case 'red':
      return '#ff707051';
    case 'yellow':
      return '#fffe7051';
    case 'green':
      return '#76ff7051';
    default:
      return '#76ff7051';
  }
};

export const Cell = styled.div<CellProps>`
  box-sizing: border-box;
  font-size: 0.8rem;
  text-align: center;
  width: ${props => (props.$width ? `${props.$width}px` : '21.1px')};
  height: 21px;
  border: 1px solid transparent;
  border-left: ${props => ((props.$isPlanned || props.$isActual) ? '1px solid transparent' : '1px solid #00000016')};
  background-color: ${props => {
    let baseColor = '#ffffff00';
    if (props.$type === 'saturday') return '#cddeff';
    if (props.$type === 'sundayOrHoliday') return '#ffcaca';
    if (props.$isPlanned) {
      return props.$chartBarColor ? getColorCode(props.$chartBarColor) : '#76ff7051';
    }
    if (props.$isActual) {
      baseColor = '#00000024';
    }
    return baseColor;
  }};
  &:hover {
    border: ${props => ((props.$isPlanned || props.$isActual) ? '1px solid #001aff83' : '1px solid transparent')};
    border-left: ${props => ((props.$isPlanned || props.$isActual) ? '1px solid #001aff83' : '1px solid #00000016')};
  }
`;