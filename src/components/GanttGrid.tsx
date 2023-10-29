// GanttGrid.tsx
import React, { useState } from 'react';
import Calendar from './Calendar';
import { getDayType, generateDates } from '../utils/CalendarUtil';
import { WBSData, ChartRow, EventRow } from '../types/DataTypes';
import { Row } from '../styles/GanttStyles';
import { MemoizedCell } from './GanttCell';

interface GanttGridProps {
  data: WBSData[];
  setData: React.Dispatch<React.SetStateAction<WBSData[]>>;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

const GanttGrid: React.FC<GanttGridProps> = ({ data, setData, dateRange }) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [plannedStartIndex, setPlannedStartIndex] = useState<number | null>(null);
  const [plannedEndIndex, setPlannedEndIndex] = useState<number | null>(null);
  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);


  const dateArray = generateDates(dateRange.startDate, dateRange.endDate);
  const getDayIndex = (date: Date, start: Date) => {
    const timeDiff = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    return dayDiff;
  };

  const handleDoubleClick = (colIndex: number, rowIndex: number) => {
    setIsEditing(rowIndex);
    setPlannedStartIndex(colIndex);
    setPlannedEndIndex(null);
    setHoveredColIndex(colIndex);
  };
  
  const handleClick = (colIndex: number) => {
    if (isEditing) {
      setPlannedEndIndex(colIndex);
      const newDateArray = [...data];
      const targetRow = newDateArray[isEditing] as ChartRow;
      setIsEditing(null);

      if (plannedStartIndex !== null) {
        targetRow.plannedStartDate = dateArray[plannedStartIndex!].toISOString().split('T')[0];
        targetRow.plannedEndDate = dateArray[colIndex].toISOString().split('T')[0];
        setData(newDateArray);
      }
    }
  };

  const handleMouseMove = (colIndex: number) => {
    if (isEditing) {
      setHoveredColIndex(colIndex);
    }
  };

  return (
    <>
      <Calendar dateArray={dateArray} />
      {data.map((row, rowIndex) => {
        if (row.rowType === "Chart") {
          return (
            <Row key={rowIndex}>
              {dateArray.map((date, colIndex) => {
                const cellType = getDayType(date);
                const chartRow = row as ChartRow;
                const charge = chartRow.charge;
                
                const plannedStartDate = new Date(chartRow.plannedStartDate);
                const plannedEndDate = new Date(chartRow.plannedEndDate);
                const plannedStartDayIndex = getDayIndex(plannedStartDate, dateRange.startDate);
                const plannedEndDayIndex = getDayIndex(plannedEndDate, dateRange.startDate);
                const isPlanned = (plannedStartDayIndex <= plannedEndDayIndex)
                  ? (plannedStartDayIndex <= colIndex && colIndex <= plannedEndDayIndex)
                  : (plannedEndDayIndex <= colIndex && colIndex <= plannedStartDayIndex);
                const isPlannedStart = plannedStartDayIndex === colIndex;
                const isHovered = isEditing === rowIndex && hoveredColIndex !== null && plannedStartIndex !== null && 
                  ((plannedStartIndex <= hoveredColIndex) 
                    ? (plannedStartIndex <= colIndex && colIndex <= hoveredColIndex) 
                    : (hoveredColIndex <= colIndex && colIndex <= plannedStartIndex));
                
                const actualStartDate = new Date(chartRow.actualStartDate);
                const actualEndDate = new Date(chartRow.actualEndDate);
                const actualStartDayIndex = getDayIndex(actualStartDate, dateRange.startDate);
                const actualEndDayIndex = getDayIndex(actualEndDate, dateRange.startDate);
                const isActual = actualStartDayIndex <= colIndex && colIndex <= actualEndDayIndex;

                return (
                  <MemoizedCell
                    key={`${rowIndex}-${colIndex}`}
                    type={cellType}
                    isPlanned={isPlanned || isHovered} 
                    isHovered={isHovered}
                    isActual={isActual}
                    charge={charge}
                    displayName={isPlannedStart ? chartRow.displayName : undefined}
                    onDoubleClick={() => handleDoubleClick(colIndex, rowIndex)}
                    onClick={() => handleClick(colIndex)}
                    onMouseMove={() => handleMouseMove(colIndex)}
                  />
                );
              })}
            </Row>
          );
        } else if (row.rowType === "Separator") {
          return (
            <Row key={rowIndex} style={{ backgroundColor: '#ddedff' }} />
          );
        } else if (row.rowType === "Event") {
          const eventRow = row as EventRow;
          return (
            <Row key={rowIndex}>
              {dateArray.map((date, colIndex) => {
                const cellType = getDayType(date);
                let isPlanned = false;
                eventRow.eventData.forEach(event => {
                  const plannedStartDate = new Date(event.plannedStartDate);
                  const plannedEndDate = new Date(event.plannedEndDate);
                  const plannedStartDayIndex = getDayIndex(plannedStartDate, dateRange.startDate);
                  const plannedEndDayIndex = getDayIndex(plannedEndDate, dateRange.startDate);
                  isPlanned = plannedStartDayIndex <= colIndex && colIndex <= plannedEndDayIndex;
                });

                return (
                  <MemoizedCell
                    key={`${rowIndex}-${colIndex}`}
                    type={cellType}
                    isPlanned={isPlanned}
                  />
                );
              })}
            </Row>
          );
        }
        return null;
      })}
    </>
  );
}

export default GanttGrid;