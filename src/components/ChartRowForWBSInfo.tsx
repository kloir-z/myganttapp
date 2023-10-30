import React, { useState, useEffect, memo, useCallback } from 'react';
import { ChartRow } from '../types/DataTypes';
import { Row, InputBox } from '../styles/GanttStyles';
import DatePicker from "react-datepicker";
import { getDayType } from '../utils/CalendarUtil';
import { MemoizedCell } from './GanttCell';

interface ChartRowProps {
  entry: ChartRow;
  index: number;
  dateArray: Date[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

const ChartRowForWBSInfo: React.FC<ChartRowProps> = ({ entry, index, dateArray, dateRange }) => {
  const [majorCategory, setMajorCategory] = useState(entry.majorCategory);
  const [middleCategory, setMiddleCategory] = useState(entry.middleCategory);
  const [subCategory, setSubCategory] = useState(entry.subCategory);
  const [task, setTask] = useState(entry.task);
  const [charge, setCharge] = useState(entry.charge);
  const [displayName, setDisplayName] = useState(entry.displayName);
  const [plannedStartDate, setPlannedStartDate] = useState(entry.plannedStartDate ? new Date(entry.plannedStartDate) : null);
  const [plannedEndDate, setPlannedEndDate] = useState(entry.plannedEndDate ? new Date(entry.plannedEndDate) : null);
  const [estimatedDaysRequired, setEstimatedDaysRequired] = useState(entry.estimatedDaysRequired);
  const [actualStartDate, setActualStartDate] = useState(entry.actualStartDate ? new Date(entry.actualStartDate) : null);
  const [actualEndDate, setActualEndDate] = useState(entry.actualEndDate ? new Date(entry.actualEndDate) : null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [plannedStartIndex, setPlannedStartIndex] = useState<number | null>(null);
  const [plannedEndIndex, setPlannedEndIndex] = useState<number | null>(null);
  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);

  useEffect(() => {
    if (plannedStartDate && plannedEndDate && plannedStartDate > plannedEndDate) {
      setPlannedStartDate(plannedEndDate);
      setPlannedEndDate(plannedStartDate);
    }
  }, [plannedStartDate, plannedEndDate]);

  const getDayIndex = useCallback((date: Date, start: Date) => {
    const timeDiff = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    return dayDiff;
  }, []);

  const handleDoubleClick = useCallback((colIndex: number, rowIndex: number) => {
    setIsEditing(rowIndex);
    setPlannedStartIndex(colIndex); 
    setPlannedEndIndex(null);
    setHoveredColIndex(colIndex);
    setPlannedStartDate(dateArray[colIndex]);
    setPlannedEndDate(dateArray[colIndex]);
  }, []);

  const handleClick = useCallback((colIndex: number) => {
    if (isEditing !== null) {
      if (plannedStartIndex !== null) {
        setPlannedStartDate(dateArray[plannedStartIndex]);
        setPlannedEndDate(dateArray[colIndex]);
      }
      setIsEditing(null);
    }
  }, [isEditing, plannedStartIndex, dateArray]);

  const handleMouseMove = useCallback((colIndex: number) => {
    if (isEditing) {
      setHoveredColIndex(colIndex);
    }
  }, [isEditing]);

  return (
    <div style={{display:'flex', flexDirection: 'row'}}>
      <Row key={index} style={{width: '650px'}}>
        <InputBox
          value={majorCategory}
          onChange={(e) => setMajorCategory(e.target.value)}
          $inputSize={majorCategory.length}
        />
        <InputBox
          value={middleCategory}
          onChange={(e) => setMiddleCategory(e.target.value)}
          $inputSize={middleCategory.length}
        />
        <InputBox
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          $inputSize={subCategory.length}
        />
        <InputBox
          value={task}
          onChange={(e) => setTask(e.target.value)}
          $inputSize={task.length}
        />
        <InputBox
          value={charge}
          onChange={(e) => setCharge(e.target.value)}
          $inputSize={charge.length}
        />
        <DatePicker
          wrapperClassName="datePicker"
          dateFormat="M/d"
          selectsRange={true}
          startDate={plannedStartDate}
          endDate={plannedEndDate}
          onChange={(update: [Date | null, Date | null]) => {
            setPlannedStartDate(update[0]);
            setPlannedEndDate(update[1]);
          }}
          isClearable={false}
        />
        <InputBox
          value={estimatedDaysRequired}
          onChange={(e) => setEstimatedDaysRequired(Number(e.target.value))}
        />
        <DatePicker
          wrapperClassName="datePicker"
          dateFormat="M/d"
          selectsRange={true}
          startDate={actualStartDate}
          endDate={actualEndDate}
          onChange={(update: [Date | null, Date | null]) => {
            setActualStartDate(update[0]);
            setActualEndDate(update[1]);
          }}
          isClearable={false}
        />
      </Row>
      <Row key={index}>
        {dateArray.map((date, colIndex) => {
          const cellType = getDayType(date);

          const plannedStartDayIndex = plannedStartDate ? getDayIndex(plannedStartDate, dateRange.startDate) : -1;
          const plannedEndDayIndex = plannedEndDate ? getDayIndex(plannedEndDate, dateRange.startDate) : -1;      
          const isPlanned = (plannedStartDayIndex <= plannedEndDayIndex)
            ? (plannedStartDayIndex <= colIndex && colIndex <= plannedEndDayIndex)
            : (plannedEndDayIndex <= colIndex && colIndex <= plannedStartDayIndex);
          const isPlannedStart = plannedStartDayIndex === colIndex;
          const isHovered = isEditing === index && hoveredColIndex !== null && plannedStartIndex !== null && 
            ((plannedStartIndex <= hoveredColIndex) 
              ? (plannedStartIndex <= colIndex && colIndex <= hoveredColIndex) 
              : (hoveredColIndex <= colIndex && colIndex <= plannedStartIndex));

          const actualStartDayIndex = actualStartDate ? getDayIndex(actualStartDate, dateRange.startDate) : -1;
          const actualEndDayIndex = actualEndDate ? getDayIndex(actualEndDate, dateRange.startDate) : -1;
          const isActual = actualStartDayIndex <= colIndex && colIndex <= actualEndDayIndex;

          return (
            <MemoizedCell
              key={`${index}-${colIndex}`}
              type={cellType}
              isPlanned={isPlanned || isHovered} 
              isHovered={isHovered}
              isActual={isActual}
              charge={charge}
              displayName={isPlannedStart ? displayName : undefined}
              onDoubleClick={() => handleDoubleClick(colIndex, index)}
              onClick={() => handleClick(colIndex)}
              onMouseMove={() => handleMouseMove(colIndex)}
            />
          );
        })}
      </Row>
    </div>
  );
};

export default memo(ChartRowForWBSInfo);