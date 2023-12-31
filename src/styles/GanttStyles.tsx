//GridStyles.ts
import styled from 'styled-components';
import { ChartBarColor } from '../types/colorAliasMapping';
import { css, keyframes } from 'styled-components';

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
      baseColor = '#0000003d';
    }
    return baseColor;
  }};
  &:hover {
    border: ${props => ((props.$isPlanned || props.$isActual) ? '1px solid #001aff83' : '1px solid transparent')};
    border-left: ${props => ((props.$isPlanned || props.$isActual) ? '1px solid #001aff83' : '1px solid #00000016')};
  }
`;

const createFadeAnimation = (fromOpacity: number, toOpacity: number) => keyframes`
  from { opacity: ${fromOpacity}};
  to { opacity: ${toOpacity}};
`;

const fadeAnimation = (fromOpacity: number, toOpacity: number) => css`
  animation: ${createFadeAnimation(fromOpacity, toOpacity)} 0.2s ease-out forwards;
`;

export const Overlay = styled.div<{ fadeStatus: 'in' | 'out' }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.659);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  ${props => props.fadeStatus === 'out' ? fadeAnimation(1, 0) : fadeAnimation(0, 1)}
  border: none;
  color: #ebebeb;
`;

export const ModalContainer = styled.div<{ fadeStatus: 'in' | 'out' }>`
  display: flex;
  flex-direction: column;
  margin: 25px;
  background: #f7f7f7;
  padding: 20px;
  border: solid 1px rgb(83 87 97);
  border-radius: 5px;
  font-size: 0.8rem;
  z-index: 15;
  ${props => props.fadeStatus === 'out' ? fadeAnimation(1, 0) : fadeAnimation(0, 1)}
  color: #1b1b1b;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 0px;
  right: 1px;
  cursor: pointer;
  font-size: 1.2rem;
  color: #252525;
  border: none;
  background: transparent;
  &:hover {
    color: #9b9b9b;
  }
`;