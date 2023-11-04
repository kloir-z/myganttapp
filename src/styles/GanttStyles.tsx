//GridStyles.ts
import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  height: 20px;
  border-bottom: solid 1px #80808047;
  position: relative;
  user-select: none;
  &.hover-effect {
    border-bottom: solid 1px #001aff83;
  }
`;

type RGB = {
  r: number;
  g: number;
  b: number;
};

const addOverlay = (baseColor: string, overlay: RGB): string => {
  const base = {
    r: parseInt(baseColor.slice(1, 3), 16),
    g: parseInt(baseColor.slice(3, 5), 16),
    b: parseInt(baseColor.slice(5, 7), 16),
  };

  const overlayAdded = {
    r: Math.min(255, base.r + overlay.r),
    g: Math.min(255, base.g + overlay.g),
    b: Math.min(255, base.b + overlay.b),
  };

  return `#${overlayAdded.r.toString(16).padStart(2, '0')}${overlayAdded.g.toString(16).padStart(2, '0')}${overlayAdded.b.toString(16).padStart(2, '0')}`;
};

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
    let baseColor = '#ffffff';
    if (props.$type === 'saturday') return '#cddeff';
    if (props.$type === 'sundayOrHoliday') return '#ffcaca';
    if (props.$isPlanned) {
      baseColor = props.$charge === 'vendor' ? '#74ff7451' : '#b05cff4d';
    }
    return baseColor;
  }};
  &.hover-effect {
    background-color: ${props => addOverlay(
      props.$type === 'saturday' ? '#cddeff' :
      props.$type === 'sundayOrHoliday' ? '#ffcaca' : 
      '#ffffff',
      { r: -20, g: -20, b: -20 }
    )};
  }
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