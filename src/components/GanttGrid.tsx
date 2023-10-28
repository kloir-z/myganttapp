// GanttGrid.tsx
import React, { memo } from 'react';
import Calendar from './Calendar';
import { getDayType, generateDates } from '../utils/CalendarUtil';
import { WBSData, ChartRow, EventRow } from '../types/DataTypes';
import { Row, Cell } from '../styles/GridStyles';

interface GanttGridProps {
  data: WBSData[];
  setData: React.Dispatch<React.SetStateAction<WBSData[]>>;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

const MemoedCell: React.FC<{ type: string }> = memo(({type}) => {
  return (
    <Cell type={type} />
  );
});

const GanttGrid: React.FC<GanttGridProps> = ({ data, dateRange }) => {
  const dateArray = generateDates(dateRange.startDate, dateRange.endDate);
  const getDayIndex = (date: Date, start: Date) => {
    const timeDiff = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    return dayDiff;
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
                let finalCellType = cellType;
                const chartRow = row as ChartRow;
                const startDate = new Date(chartRow.plannedStartDate);
                const endDate = new Date(chartRow.plannedEndDate);
                const startDayIndex = getDayIndex(startDate, dateRange.startDate);
                const endDayIndex = getDayIndex(endDate, dateRange.startDate);

                if (startDayIndex <= colIndex && colIndex <= endDayIndex) {
                  finalCellType = 'task';
                }

                return (
                  <MemoedCell
                    key={`${rowIndex}-${colIndex}`}
                    type={finalCellType}
                  />
                );
              })}
            </Row>
          );
        } else if (row.rowType === "Separator") {
          return (
            <Row key={rowIndex} style={{ backgroundColor: '#ddedff' }}>
              {/* 他のセルを追加する場合はここに */}
            </Row>
          );
        } else if (row.rowType === "Event") {
          const eventRow = row as EventRow;
          return (
            <Row key={rowIndex}>
              {dateArray.map((date, colIndex) => {
                const cellType = getDayType(date);
                let finalCellType = cellType;
                eventRow.eventData.forEach(event => {
                  const startDate = new Date(event.plannedStartDate);
                  const endDate = new Date(event.plannedEndDate);
                  const startDayIndex = getDayIndex(startDate, dateRange.startDate);
                  const endDayIndex = getDayIndex(endDate, dateRange.startDate);

                  if (startDayIndex <= colIndex && colIndex <= endDayIndex) {
                    finalCellType = 'event';
                  }
                });

                return (
                  <MemoedCell
                    key={`${rowIndex}-${colIndex}`}
                    type={finalCellType}
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