import React, { useState, memo, useEffect, useCallback  } from 'react';
import { ChartRow } from '../types/DataTypes';
import { ChartCell } from './ChartCell';
import { useDispatch } from 'react-redux';
import { setPlannedStartDate, setPlannedEndDate, setActualStartDate, setActualEndDate } from '../reduxComponents/store';
import { debounce } from 'lodash';

interface ChartRowProps {
  entry: ChartRow;
  dateArray: Date[];
  gridRef: React.RefObject<HTMLDivElement>;
}

const GridHorizontal: React.FC<ChartRowProps> = memo(({ entry, dateArray, gridRef }) => {
  const dispatch = useDispatch();
  const charge = entry.charge;
  const [localPlannedStartDate, setLocalPlannedStartDate] = useState(entry.plannedStartDate ? new Date(entry.plannedStartDate) : null);
  const [localPlannedEndDate, setLocalPlannedEndDate] = useState(entry.plannedEndDate ? new Date(entry.plannedEndDate) : null);
  const [localActualStartDate, setLocalActualStartDate] = useState(entry.actualStartDate ? new Date(entry.actualStartDate) : null);
  const [localActualEndDate, setLocalActualEndDate] = useState(entry.actualEndDate ? new Date(entry.actualEndDate) : null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isShiftKeyDown, setIsShiftKeyDown] = useState(false);
  const calendarWidth = dateArray.length * 21;

  const calculateDateFromX = (x: number) => {
    const dateIndex = Math.floor(x / 21);
    if (dateIndex < 0) {
      return adjustToLocalMidnight(dateArray[0]);
    } else if (dateIndex >= dateArray.length) {
      return adjustToLocalMidnight(dateArray[dateArray.length - 1]);
    }
    return adjustToLocalMidnight(dateArray[dateIndex]);
  };

  const adjustToLocalMidnight = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  
  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const clickedDate = calculateDateFromX(relativeX);
    setIsEditing(true);
    setCurrentDate(clickedDate);
    const isShiftKeyDown = event.shiftKey;
    setIsShiftKeyDown(isShiftKeyDown);
  
    const setStartDate = isShiftKeyDown ? setLocalActualStartDate : setLocalPlannedStartDate;
    const setEndDate = isShiftKeyDown ? setLocalActualEndDate : setLocalPlannedEndDate;
    setStartDate(clickedDate);
    setEndDate(clickedDate);
  }

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (!gridRect || !currentDate || !isEditing) return;
  
    const scrollLeft = gridRef.current?.scrollLeft || 0;
    const relativeX = event.clientX - gridRect.left + scrollLeft;
    const newDate = calculateDateFromX(relativeX);
  
    const isEndDate = newDate > currentDate;
    if (isShiftKeyDown) {
      setLocalActualStartDate(isEndDate ? currentDate : newDate);
      setLocalActualEndDate(isEndDate ? newDate : currentDate);
    } else {
      setLocalPlannedStartDate(isEndDate ? currentDate : newDate);
      setLocalPlannedEndDate(isEndDate ? newDate : currentDate);
    }
  }, [isEditing, currentDate, isShiftKeyDown]);
  
  useEffect(() => {
    if (!isEditing) {
      setLocalPlannedStartDate(entry.plannedStartDate ? new Date(entry.plannedStartDate) : null);
      setLocalPlannedEndDate(entry.plannedEndDate ? new Date(entry.plannedEndDate) : null);
      setLocalActualStartDate(entry.actualStartDate ? new Date(entry.actualStartDate) : null);
      setLocalActualEndDate(entry.actualEndDate ? new Date(entry.actualEndDate) : null);
    }
  }, [entry.plannedStartDate, entry.plannedEndDate, entry.actualStartDate, entry.actualEndDate, isEditing]);

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${year}/${formattedMonth}/${formattedDay}`;
  }

  const syncToStore = useCallback(() => {
    if (isEditing) {
      if (localPlannedStartDate) {dispatch(setPlannedStartDate({ id: entry.id, startDate: formatDate(localPlannedStartDate) }));}
      if (localPlannedEndDate) {dispatch(setPlannedEndDate({ id: entry.id, endDate: formatDate(localPlannedEndDate) }));}
      if (localActualStartDate) {dispatch(setActualStartDate({ id: entry.id, startDate: formatDate(localActualStartDate) }));}
      if (localActualEndDate) {dispatch(setActualEndDate({ id: entry.id, endDate: formatDate(localActualEndDate) }));}
    }
  }, [localPlannedStartDate, localPlannedEndDate, localActualStartDate, localActualEndDate, isEditing, dispatch]);

  const debouncedSyncToStore = useCallback(debounce(syncToStore, 20), [syncToStore]);

  useEffect(() => {
    debouncedSyncToStore();
    return () => debouncedSyncToStore.cancel();
  }, [debouncedSyncToStore]);

  return (
    <div style={{position: 'absolute', height: '21px', width: `${calendarWidth}px`}} onDoubleClick={handleDoubleClick}>
      {isEditing && (
        <div
          style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, cursor: 'pointer'}}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsEditing(false)}
        />
      )}
      {localActualStartDate && localActualEndDate ? (() => {
        const startIndex = dateArray.findIndex(date => date >= localActualStartDate);
        let endIndex = dateArray.findIndex(date => date >= localActualEndDate);
        endIndex = endIndex !== -1 ? endIndex : dateArray.length - 1;
        const dateArrayStart = dateArray[0];
        const dateArrayEnd = dateArray[dateArray.length - 1];
        if (localActualStartDate > dateArrayEnd || localActualEndDate < dateArrayStart) {
          return null;
        }
        if (startIndex !== -1 && endIndex !== -1) {
          const width = ((endIndex - startIndex + 1) * 21) + 0.3;
          const leftPosition = startIndex * 21;
  
          return (
            <div style={{position: 'absolute', left: `${leftPosition}px`, width: `${width}px`}}>
              <ChartCell
                isActual={true}
                width={width}
              />
            </div>
          );
        }
        return null;
      })() : null}
      {localPlannedStartDate && localPlannedEndDate ? (() => {
        const startIndex = dateArray.findIndex(date => date >= localPlannedStartDate);
        let endIndex = dateArray.findIndex(date => date >= localPlannedEndDate);
        endIndex = endIndex !== -1 ? endIndex : dateArray.length - 1;
        const dateArrayStart = dateArray[0];
        const dateArrayEnd = dateArray[dateArray.length - 1];
        if (localPlannedStartDate > dateArrayEnd || localPlannedEndDate < dateArrayStart) {
          return null;
        }
        if (startIndex !== -1 && endIndex !== -1) {
          const width = ((endIndex - startIndex + 1) * 21) + 0.3;
          const leftPosition = startIndex * 21;
  
          return (
            <div style={{position: 'absolute', left: `${leftPosition}px`, width: `${width}px` }}>
              <ChartCell
                entryId={entry.id}
                isPlanned={true}
                charge={charge}
                width={width}
              />
            </div>
          );
        }
        return null;
      })() : null}
    </div>
  );
});

export default memo(GridHorizontal);