import React, { useState, memo } from 'react';
import { ChartRow } from '../types/DataTypes';
import { Row, InputBox } from '../styles/GanttStyles';
import DatePicker from "react-datepicker";
import { MemoizedCell } from './GanttCell';

interface WBSInfoProps {
    entry: ChartRow;
    index: number;
    dateArray: Date[];
    wbsWidth: number;
    charge: string;
    setCharge: (charge: string) => void; 
    displayName: string;
    setDisplayName: (charge: string) => void; 
    plannedStartDate: Date | null;
    setPlannedStartDate: (date: Date | null) => void;
    plannedEndDate: Date | null;
    setPlannedEndDate: (date: Date | null) => void;
    actualStartDate: Date | null;
    setActualStartDate: (date: Date | null) => void;
    actualEndDate: Date | null;
    setActualEndDate: (date: Date | null) => void;
  }
  
  const WBSInfo: React.FC<WBSInfoProps> = ({
    entry,
    index,
    dateArray,
    wbsWidth,
    charge,
    setCharge,
    displayName,
    setDisplayName,
    plannedStartDate,
    setPlannedStartDate,
    plannedEndDate,
    setPlannedEndDate,
    actualStartDate,
    setActualStartDate,
    actualEndDate,
    setActualEndDate
  }) => {
  const [majorCategory, setMajorCategory] = useState(entry.majorCategory);
  const [middleCategory, setMiddleCategory] = useState(entry.middleCategory);
  const [subCategory, setSubCategory] = useState(entry.subCategory);
  const [task, setTask] = useState(entry.task);
  const [estimatedDaysRequired, setEstimatedDaysRequired] = useState(entry.estimatedDaysRequired);
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
      {/* WBS部分 */}
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
      {/* チャート部分 */}
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

export default memo(WBSInfo);