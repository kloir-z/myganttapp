import React, { useState, useEffect } from "react";
import { Overlay, ModalContainer, CloseButton } from "../styles/GanttStyles";
import { toLocalISOString } from "../utils/CalendarUtil";
import { ChartBarColor, AliasMapping } from "../types/colorAliasMapping";

type SettingsModalProps = {
  show: boolean;
  onClose: () => void;
  dateArray: Date[];
  setDateRange: (range: { startDate: Date, endDate: Date }) => void;
  aliasMapping: AliasMapping;
  setAliasMapping: (mapping: AliasMapping) => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose, setDateRange, dateArray, aliasMapping, setAliasMapping }) => {
  const [fadeStatus, setFadeStatus] = useState<'in' | 'out'>('in');
  const [startDate, setStartDate] = useState<Date | null>(new Date(dateArray[0]));
  const [endDate, setEndDate] = useState<Date | null>(new Date(dateArray[dateArray.length - 1]));
  const colors: ChartBarColor[] = ['lightblue', 'blue', 'purple', 'pink', 'red', 'yellow', 'green'];

  const handleAliasChange = (color: string, alias: string) => {
    setAliasMapping({
      ...aliasMapping,
      [color]: alias,
    });
  };

  useEffect(() => {
    if (startDate && endDate) {
      const maxEndDate = new Date(startDate);
      maxEndDate.setFullYear(maxEndDate.getFullYear() + 5);

      if (endDate > maxEndDate) {
        setEndDate(maxEndDate);
      } else {
        setDateRange({ startDate, endDate });
      }
    }
  }, [startDate, endDate, setDateRange]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value ? new Date(e.target.value) : null;
    if (newStartDate && endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value ? new Date(e.target.value) : null;
    if (startDate && newEndDate && startDate > newEndDate) {
      return
    }
    setEndDate(newEndDate);
  };

  const handleClose = () => {
    setFadeStatus('out');
    setTimeout(() => {
      setFadeStatus('in');
      onClose();
    }, 210);
  };

  return (
    show ? 
    <Overlay fadeStatus={fadeStatus} onMouseDown={handleClose}>
      <ModalContainer fadeStatus={fadeStatus} onMouseDown={e => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>×</CloseButton>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <input 
            type='date' 
            value={startDate ? toLocalISOString(startDate) : ''} 
            onChange={handleStartDateChange}
          />
          <input 
            type='date' 
            value={endDate ? toLocalISOString(endDate) : ''} 
            onChange={handleEndDateChange}
          />
        </div>
        {colors.map(color => (
          <div key={color}>
            <label>{color}: </label>
            <input
              type="text"
              value={aliasMapping[color] || ''}
              onChange={(e) => handleAliasChange(color, e.target.value)}
            />
          </div>
        ))}
      </ModalContainer>
    </Overlay>
    : null
  );
};

export default SettingsModal;