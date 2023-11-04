import React, { useState, memo } from 'react';
import { ChartRow } from '../types/DataTypes';
import { Row, InputBox } from '../styles/GanttStyles';
import DatePicker from "react-datepicker";
import { MemoizedCell } from './GanttCell';

interface ChartRowProps {
  entry: ChartRow;
  index: number;
  dateArray: Date[];
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  wbsWidth: number;
  wbsHeight: number;
}

const ChartRowForWBSInfo: React.FC<ChartRowProps> = ({ entry, index, dateArray, dateRange, wbsWidth, wbsHeight }) => {
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
  const [isEditing, setIsEditing] = useState(false);
  const calendarWidth = dateArray.length * 21;

  const calculateDateFromX = (x: number) => {
    const dateIndex = Math.floor(x / 21);
    return dateArray[dateIndex];
  };
  
  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();  
    const relativeX = event.clientX - rect.left;
    setIsEditing(true);
    setPlannedStartDate(calculateDateFromX(relativeX));
    setPlannedEndDate(calculateDateFromX(relativeX));
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollX = window.scrollX;
    let relativeX = event.clientX - rect.left + scrollX;
    relativeX = Math.floor((relativeX - wbsWidth) / 21) * 21;
    if (!isEditing) return;
    const newDate = calculateDateFromX(relativeX);
    if (plannedStartDate && newDate > plannedStartDate) {
      setPlannedEndDate(newDate);
    } else if (plannedEndDate) {
      setPlannedStartDate(newDate);
    }
  };

  return (
    <div style={{width: `${wbsWidth + calendarWidth}px`, display: 'flex', flexDirection: 'row'}}>
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsEditing(false)}
        />
      )}
      <div style={{width: `${wbsWidth}px`}}>
        <Row
          key={index}
          className="wbsRow"
        >
          <InputBox value={majorCategory} onChange={(e) => setMajorCategory(e.target.value)} $inputSize={majorCategory.length} />
          <InputBox value={middleCategory} onChange={(e) => setMiddleCategory(e.target.value)} $inputSize={middleCategory.length} />
          <InputBox value={subCategory} onChange={(e) => setSubCategory(e.target.value)} $inputSize={subCategory.length} />
          <InputBox value={task} onChange={(e) => setTask(e.target.value)} $inputSize={task.length} />
          <InputBox value={charge} onChange={(e) => setCharge(e.target.value)} $inputSize={charge.length} />
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
          <InputBox value={estimatedDaysRequired} onChange={(e) => setEstimatedDaysRequired(Number(e.target.value))} />
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
      </div>
      <div style={{width: `${calendarWidth}px`}}>
        <Row
          key={index}
          onDoubleClick={handleDoubleClick}
          className="wbsRow"
        >
          {plannedStartDate && plannedEndDate ? (() => {
            const startIndex = dateArray.findIndex(date => date >= plannedStartDate);
            const endIndex = dateArray.findIndex(date => date >= plannedEndDate);

            if (startIndex !== -1 && endIndex !== -1) {
              const width = (endIndex - startIndex + 1) * 21;
              const leftPosition = (startIndex * 21);

              return (
                <div
                  style={{
                    position: 'absolute',
                    left: `${leftPosition}px`,
                    width: `${width}px`
                  }}
                >
                  <MemoizedCell
                    isPlanned={true}
                    charge={charge}
                    displayName={displayName}
                    width={width}
                  />
                </div>
              );
            }
            return null;
          })() : null}
        </Row>
      </div>
    </div>
  );
};

export default memo(ChartRowForWBSInfo);