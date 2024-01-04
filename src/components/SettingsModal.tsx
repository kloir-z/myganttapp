import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Overlay, ModalContainer, CloseButton } from "../styles/GanttStyles";
import { ChartBarColor, AliasMapping } from "../types/colorAliasMapping";
import { Column, Row, DefaultCellTypes } from "@silevis/reactgrid";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, simpleSetData } from '../reduxComponents/store';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en-ca';
import 'dayjs/locale/en-in';
import 'dayjs/locale/en';
import { useWBSData } from '../hooks/useWBSData';
import { ColumnMap, columnMap } from "../hooks/useWBSData";

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
  columnVisibility: { [key: string]: boolean };
  toggleColumnVisibility: (columnId: string | number) => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose, dateRange, setDateRange, aliasMapping, setAliasMapping, columns, setColumns, columnVisibility, toggleColumnVisibility }) => {
  const [fadeStatus, setFadeStatus] = useState<'in' | 'out'>('in');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(dateRange.startDate));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(dateRange.endDate));
  const data = useSelector((state: RootState) => state.wbsData);
  const dispatch = useDispatch();
  const colors: ChartBarColor[] = ['lightblue', 'blue', 'purple', 'pink', 'red', 'yellow', 'green'];
  const [fileName, setFileName] = useState("filename");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { initialColumns } = useWBSData();
  const browserLocale = navigator.language;
  let locale;
  if (["ja", "zh", "ko", "hu"].includes(browserLocale)) {
    locale = 'en-ca';
  } else if (["in", "sa", "eu", "au"].includes(browserLocale)) {
    locale = 'en-in';
  } else {
    locale = 'en';
  }

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
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name.replace('.json', ''));
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

  const isValidDateRange = (date: Dayjs) => {
    const earliestDate = dayjs('1900-01-01');
    const latestDate = dayjs();
    return date.isAfter(earliestDate) && date.isBefore(latestDate);
  };

  useEffect(() => {
    if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
      if (!isValidDateRange(startDate)) {
        setStartDate(dayjs());
        return;
      }

      const maxEndDate = dayjs(startDate).add(5, 'year');
      if (endDate.isAfter(maxEndDate)) {
        setEndDate(maxEndDate);
      } else {
        setDateRange({ startDate: startDate.toDate(), endDate: endDate.toDate() });
      }
    }
  }, [startDate, endDate, setDateRange]);

  const handleStartDateChange = (date: Dayjs | null) => {
    if (!date || !isValidDateRange(date)) {
      return;
    }
    setStartDate(date);
  
    if (!endDate || date.isAfter(endDate)) {
      const newMaxEndDate = dayjs(date).add(3, 'month');
      setEndDate(newMaxEndDate);
    }
  };
  

  const handleEndDateChange = (date: Dayjs | null) => {
    if (!date || !isValidDateRange(date) || (startDate && startDate.isAfter(date))) {
      return;
    }
    setEndDate(date);
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
        <h3>Chart Date Range:</h3>
        <div style={{ marginLeft: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', position: 'relative' }}>
            <LocalizationProvider
              dateFormats={locale === 'en-ca' ? { monthAndYear: 'YYYY / MM' } : undefined}
              dateAdapter={AdapterDayjs}
              adapterLocale={locale}
            >
              <DatePicker
                label="Clendar Start"
                value={startDate}
                onChange={handleStartDateChange}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '4px',
                    padding: '0px'
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.8rem',
                    padding: '5px',
                    width: '7rem',
                  },
                  '& .MuiButtonBase-root': {
                    fontSize: '0.8rem',
                    padding: '3px',
                    margin: '0px'
                  },
                }}
              />
              <DatePicker
                label="Calendar End"
                value={endDate}
                onChange={handleEndDateChange}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '4px',
                    padding: '0px'
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.8rem',
                    padding: '5px',
                    width: '7rem'
                  },
                  '& .MuiButtonBase-root': {
                    padding: '3px',
                    margin: '0px'
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <h3>Chart Color:</h3>
        <div style={{ marginLeft: '10px' }}>
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
        </div>
        <h3>Export File(.json):</h3>
        <div style={{ marginLeft: '10px' }}>
          <input
            type="text"
            value={fileName}
            
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
          />
          <button onClick={handleExport}>Export</button>
        </div>
        <h3>Import File(.json):</h3>
        <div style={{ marginLeft: '10px' }}>
          <button onClick={() => fileInputRef.current?.click()}>Import</button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} accept=".json" />
        </div>
        <h3>Column Visibility</h3>
        <div style={{ marginLeft: '10px' }}>
          {initialColumns.map(column => (
            <div key={column.columnId}>
              <label>
                <input
                  type="checkbox"
                  checked={columnVisibility[column.columnId]}
                  onChange={() => toggleColumnVisibility(column.columnId)}
                />
                {columnMap[column.columnId as keyof ColumnMap]}
              </label>
            </div>
          ))}
        </div>
      </ModalContainer>
    </Overlay>
    : null
  );
};

export default SettingsModal;