//GridStyles.ts
import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  height: 20px;
  border-bottom: solid 1px #80808047;
`;

interface CellProps {
  $type?: string;
  $isPlanned?: boolean;
  $isHovered?: boolean;
  $isActual?: boolean;
  $charge?: string;
}

const lightenDarkenColor = (col: string, amt: number) => {
  let usePound = false;
  
  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }

  let num = parseInt(col, 16);

  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if  (r < 0) r = 0;

  let b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255;
  else if  (b < 0) b = 0;

  let g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255;
  else if  (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

export const Cell = styled.div<CellProps>`
  position: relative;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-left: 1px solid #80808047;
  border-bottom: 1px solid ${props => (props.$isHovered ? 'red' : '#80808047')};
  text-align: center;
  font-size: 0.8rem;
  overflow: visible;
  background-color: ${props => {
    let baseColor = '#ffffff';

    if (props.$type === 'saturday') return '#cddeff';
    if (props.$type === 'sundayOrHoliday') return '#ffcaca';

    if (props.$isPlanned) {
      baseColor = props.$charge === 'vendor' ? '#ccffcc' : '#e6ccff';
    }

    if (props.$isActual) {
      return lightenDarkenColor(baseColor, -40);
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
  top: ${props => (props.$isHovered ? '-10px' : '0px')};
  opacity: ${props => (props.$isHovered ? '0.5' : '1')};
  user-select: ${props => (props.$isHovered ? 'none' : 'auto')};
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
  &:focus {
    outline: none;
    border: solid 1px #007bff;
  }
`;