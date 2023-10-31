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
  rowWidth: number;
  columnXPositions: number[];
}

const ChartRowForWBSInfo: React.FC<ChartRowProps> = ({ entry, index, dateArray, dateRange, rowWidth, columnXPositions }) => {
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
  const [startX, setStartX] = useState<number | null>(null);
  const [endX, setEndX] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (plannedStartDate && plannedEndDate && plannedStartDate > plannedEndDate) {
      setPlannedStartDate(plannedEndDate);
      setPlannedEndDate(plannedStartDate);
    }
  }, [plannedStartDate, plannedEndDate]);

  const calculateDateFromX = (x: number) => {
    const columnStartX = 650; 
    const dateIndex = Math.floor((x - columnStartX) / 21);
    return dateArray[dateIndex];
  };
  
  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();  
    const relativeX = event.clientX - rect.left;
    setStartX(relativeX);
    setEndX(null);
    setIsEditing(true);
    setPlannedStartDate(calculateDateFromX(relativeX));
    setPlannedEndDate(calculateDateFromX(relativeX));
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing) return;
    const rect = event.currentTarget.getBoundingClientRect();  
    const relativeX = event.clientX - rect.left;
    const endDate = calculateDateFromX(relativeX);
    setPlannedEndDate(endDate);
  };
  
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing) return;
    const rect = event.currentTarget.getBoundingClientRect();  
    const relativeX = event.clientX - rect.left;
    setEndX(relativeX);
    
    const endDate = calculateDateFromX(relativeX);
    setPlannedEndDate(endDate);
    setIsEditing(false);
  };

  return (
    <div style={{width: `${rowWidth}px`}}>
      <Row
        key={index}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
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
        {plannedStartDate && plannedEndDate && columnXPositions.length > 0 ? (
          <>
            {
              dateArray.map((date, i) => {
                if (date >= plannedStartDate && date <= plannedEndDate) {
                  const dateOnly = (d: Date) => new Date(d.setHours(0,0,0,0));

                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${650+columnXPositions[i]}px`,
                      }}
                    >
                      <MemoizedCell
                        charge={charge}
                        isPlanned={true}
                        displayName={dateOnly(date).getTime() === dateOnly(plannedStartDate).getTime() ? displayName : undefined}
                      />
                    </div>
                  );
                }
                return null;
              })
            }
          </>
        ) : null}
      </Row>
    </div>
  );
};

export default memo(ChartRowForWBSInfo);