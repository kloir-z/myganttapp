//GridStyles.ts
import styled from 'styled-components';

export const GanttRow = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 21px;
  background: none;
  border-bottom: solid 1px #00000016;
  position: relative;
  user-select: none;
  align-items: center;
  &.hover-effect {
    border-bottom: solid 1px #001aff83;
  };
`;

interface CellProps {
  $type?: string;
  $isPlanned?: boolean;
  $isActual?: boolean;
  $charge?: string;
  $width?: number;
}

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
      baseColor = props.$charge === 'vendor' ? '#74ff7451' : '#b05cff4d';
    }
    if (props.$isActual) {
      baseColor = '#00000024';
    }
    return baseColor;
  }};
  &:hover {
    border: 1px solid #001aff83;
  }
`;