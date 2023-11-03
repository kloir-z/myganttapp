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
  rowWidth: number;
  wbsHeight: number;
}

const ChartRowForWBSInfo: React.FC<ChartRowProps> = ({ entry, index, dateArray, dateRange, rowWidth, wbsHeight }) => {
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

  const calculateDateFromX = (x: number) => {
    const columnStartX = 650;
    const dateIndex = Math.floor((x - columnStartX) / 21);
    return dateArray[dateIndex];
  };
  
  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();  
    const relativeX = event.clientX - rect.left;
    if (relativeX < 650) return;
    setIsEditing(true);
    setPlannedStartDate(calculateDateFromX(relativeX));
    setPlannedEndDate(calculateDateFromX(relativeX));
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();  
    let relativeX = event.clientX - rect.left;
    relativeX = Math.floor((relativeX - 650) / 21) * 21 + 650;
    if (relativeX < 650) return;
    if (!isEditing) return;
    const newDate = calculateDateFromX(relativeX);
    if (plannedStartDate && newDate > plannedStartDate) {
      setPlannedEndDate(newDate);
    } else if (plannedEndDate) {
      setPlannedStartDate(newDate);
    }
  };
  
  const handleClick = () => {
    if (!isEditing) return;
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
        {plannedStartDate && plannedEndDate ? (
          <>
            {(() => {
              const startIndex = dateArray.findIndex(date => date >= plannedStartDate);
              const endIndex = dateArray.findIndex(date => date >= plannedEndDate);

              if (startIndex !== -1 && endIndex !== -1) {
                const width = (endIndex - startIndex + 1) * 21;
                const leftPosition = 650 + (startIndex * 21);

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
            })()}
          </>
        ) : null}
      </Row>
    </div>
  );
};

export default memo(ChartRowForWBSInfo);