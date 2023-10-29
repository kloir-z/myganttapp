//GridStyles.ts
import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  height: 20px;
  border-bottom: solid 1px #80808047;
`;

interface CellProps {
  type?: string;
  isPlanned?: boolean;
  isHovered?: boolean;
  isActual?: boolean;
  charge?: string;
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
  opacity: ${props => (props.isHovered ? '0.5' : '1')};
  border-bottom: 1px solid ${props => (props.isHovered ? 'red' : '#80808047')};
  text-align: center;
  font-size: 0.8rem;
  background-color: ${props => {
    let baseColor = '#ffffff';

    if (props.type === 'saturday') return '#cddeff';
    if (props.type === 'sundayOrHoliday') return '#ffcaca';

    if (props.isPlanned) {
      baseColor = props.charge === 'vendor' ? '#ccffcc' : '#e6ccff';
    }

    if (props.isActual) {
      return lightenDarkenColor(baseColor, -40);
    }

    return baseColor;
  }};
`;

export const PlanLabel = styled.label`
  position: absolute;
  z-index: 1;
  left: 2px;
  top: 1px; 
`;
