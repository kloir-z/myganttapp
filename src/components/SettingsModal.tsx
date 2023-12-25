import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Overlay, ModalContainer, CloseButton } from "../styles/GanttStyles";
import { toLocalISOString } from "../utils/CalendarUtil";
import { ChartBarColor, AliasMapping } from "../types/colorAliasMapping";
import { Column, Row, DefaultCellTypes } from "@silevis/reactgrid";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, simpleSetData } from '../reduxComponents/store';

type SettingsModalProps = {
  show: boolean;
  onClose: () => void;
  dateRange: { startDate: Date, endDate: Date };
  setDateRange: (range: { startDate: Date, endDate: Date }) => void;
  aliasMapping: AliasMapping;
  setAliasMapping: (mapping: AliasMapping) => void;
  headerRow: Row<DefaultCellTypes>;
  columns: Column[];
  setColumns: Dispatch<SetStateAction<Column[]>>;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose, dateRange, setDateRange, aliasMapping, setAliasMapping, columns, setColumns }) => {
  const [fadeStatus, setFadeStatus] = useState<'in' | 'out'>('in');
  const [startDate, setStartDate] = useState<Date | null>(dateRange.startDate);
  const [endDate, setEndDate] = useState<Date | null>(dateRange.endDate);
  const data = useSelector((state: RootState) => state.wbsData);
  const dispatch = useDispatch();
  const colors: ChartBarColor[] = ['lightblue', 'blue', 'purple', 'pink', 'red', 'yellow', 'green'];
  const [fileName, setFileName] = useState("settings");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const settingsData = {
      aliasMapping,
      dateRange: {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      },
      columns,
      data,
    };

    const jsonData = JSON.stringify(settingsData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          try {
            const parsedData = JSON.parse(text);
  
            let importStatus = {
              aliasMapping: false,
              dateRange: false,
              columns: false,
              data: false,
            };
  
            if (parsedData.aliasMapping) {
              setAliasMapping(parsedData.aliasMapping);
              importStatus.aliasMapping = true;
            }
            if (parsedData.dateRange && parsedData.dateRange.startDate && parsedData.dateRange.endDate) {
              setDateRange({
                startDate: new Date(parsedData.dateRange.startDate),
                endDate: new Date(parsedData.dateRange.endDate),
              });
              importStatus.dateRange = true;
            }
            if (parsedData.columns && Array.isArray(parsedData.columns)) {
              setColumns(parsedData.columns);
              importStatus.columns = true;
            }
            if (parsedData.data) {
              dispatch(simpleSetData(parsedData.data));
              importStatus.data = true;
            }
  
            let message = 'Import Results:\n';
            Object.keys(importStatus).forEach((key) => {
              const typedKey = key as keyof typeof importStatus;
              message += `${typedKey}: ${importStatus[typedKey] ? 'Success' : 'Failed'}\n`;
            });
  
            alert(message);
  
          } catch (error) {
            alert("Error: An error occurred while loading the file.");
          }
        }
      };
      reader.readAsText(file);
    }
  };    

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
            value={dateRange.startDate ? toLocalISOString(dateRange.startDate) : ''} 
            onChange={handleStartDateChange}
          />
          <input 
            type='date' 
            value={dateRange.endDate ? toLocalISOString(dateRange.endDate) : ''} 
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
        <label>Save Filename(.json): </label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
        />
        <button onClick={handleExport}>Export</button>
        <button onClick={() => fileInputRef.current?.click()}>Import</button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} accept=".json" />
      </ModalContainer>
    </Overlay>
    : null
  );
};

export default SettingsModal;