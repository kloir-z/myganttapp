//GridStyles.ts
import styled from 'styled-components';

export const RowContainer = styled.div`
  background: none;
  &.hover-effect {
    border-bottom: solid 1px #001aff83;
  }
`;

export const Row = styled.div`
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
  box-sizing: border-box;
  font-size: 0.8rem;
  text-align: center;
  width: ${props => (props.$width ? `${props.$width}px` : '21.1px')};
  height: ${props => (props.$isActual ? '21px' : '21px')};
  border-left: ${props => ((props.$isPlanned || props.$isActual) ? 'none' : '1px solid #00000016')};
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
  box-sizing: border-box;
  position: absolute;
  z-index: 1;
  left: 0px;
  background: none;
  border: solid 1px #007bff49;
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
  box-sizing: border-box;
  font-size: 0.8rem;
  line-height: 16px;
  padding: 0px;
  background: none;
  border: solid 1px #007bff49;
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