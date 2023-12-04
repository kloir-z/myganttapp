import React, { useState, memo, useEffect, useCallback  } from 'react';
import { ChartRow } from '../types/DataTypes';
import { useDispatch } from 'react-redux';
import { setPlannedStartDate, setPlannedEndDate, setActualStartDate, setActualEndDate } from '../reduxComponents/store';
import { debounce } from 'lodash';
import { formatDate, adjustToLocalMidnight } from '../utils/chartHelpers'; 
import ChartBar from './ChartBar';

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
  const [isBarDragging, setIsBarDragging] = useState(false);
  const [originalStartDate, setOriginalStartDate] = useState<Date | null>(null);
  const [originalEndDate, setOriginalEndDate] = useState<Date | null>(null);
  const [initialMouseX, setInitialMouseX] = useState<number | null>(null);
  const [isShiftKeyDown, setIsShiftKeyDown] = useState(false);

  const handleBarMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsBarDragging(true);
    setInitialMouseX(event.clientX);
    setOriginalStartDate(localPlannedStartDate);
    setOriginalEndDate(localPlannedEndDate);  
  };
  
  const calendarWidth = dateArray.length * 21;

  const calculateDateFromX = useCallback((x: number) => {
    const dateIndex = Math.floor(x / 21);
    if (dateIndex < 0) {
      return adjustToLocalMidnight(dateArray[0]);
    } else if (dateIndex >= dateArray.length) {
      return adjustToLocalMidnight(dateArray[dateArray.length - 1]);
    }
    return adjustToLocalMidnight(dateArray[dateIndex]);
  }, [dateArray]);
  
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
    if (isBarDragging && initialMouseX !== null && originalStartDate && originalEndDate) {
      const currentMouseX = event.clientX;
      const deltaX = currentMouseX - initialMouseX;
      const gridSteps = Math.floor(deltaX / 21);
  
      const newStartDate = new Date(originalStartDate.getTime());
      newStartDate.setDate(newStartDate.getDate() + gridSteps);
      setLocalPlannedStartDate(newStartDate);

      const newEndDate = new Date(originalEndDate.getTime());
      newEndDate.setDate(newEndDate.getDate() + gridSteps);
      setLocalPlannedEndDate(newEndDate);
    } else if (isEditing) {
      const gridRect = gridRef.current?.getBoundingClientRect();
      if (!gridRect || !currentDate) return;
  
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
    }
  }, [isEditing, currentDate, isShiftKeyDown, calculateDateFromX, gridRef, isBarDragging, initialMouseX, originalStartDate, originalEndDate]);
  
  useEffect(() => {
    if (!isEditing && !isBarDragging) {
      setLocalPlannedStartDate(entry.plannedStartDate ? new Date(entry.plannedStartDate) : null);
      setLocalPlannedEndDate(entry.plannedEndDate ? new Date(entry.plannedEndDate) : null);
      setLocalActualStartDate(entry.actualStartDate ? new Date(entry.actualStartDate) : null);
      setLocalActualEndDate(entry.actualEndDate ? new Date(entry.actualEndDate) : null);
    }
  }, [entry.plannedStartDate, entry.plannedEndDate, entry.actualStartDate, entry.actualEndDate, isEditing, isBarDragging]);

  const syncToStore = useCallback(() => {
    if (isEditing || isBarDragging) {
      if (localPlannedStartDate) {dispatch(setPlannedStartDate({ id: entry.id, startDate: formatDate(localPlannedStartDate) }));}
      if (localPlannedEndDate) {dispatch(setPlannedEndDate({ id: entry.id, endDate: formatDate(localPlannedEndDate) }));}
      if (localActualStartDate) {dispatch(setActualStartDate({ id: entry.id, startDate: formatDate(localActualStartDate) }));}
      if (localActualEndDate) {dispatch(setActualEndDate({ id: entry.id, endDate: formatDate(localActualEndDate) }));}
    }
  }, [localPlannedStartDate, localPlannedEndDate, localActualStartDate, localActualEndDate, isEditing, isBarDragging, dispatch, entry.id]);

  const debouncedSyncToStore = debounce(syncToStore, 20);

  useEffect(() => {
    debouncedSyncToStore();
    return () => debouncedSyncToStore.cancel();
  }, [debouncedSyncToStore]);

  const handleMouseUp = () => {
    setIsEditing(false);
    setIsBarDragging(false);
    setInitialMouseX(null);
    syncToStore();
  };

  return (
    <div style={{position: 'absolute', height: '21px', width: `${calendarWidth}px`}} onDoubleClick={handleDoubleClick}>
      {(isEditing || isBarDragging) && (
        <div
          style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: 'calc(100vh - 12px)', zIndex: 9999, cursor: 'pointer'}}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}
      {localActualStartDate && localActualEndDate && (
        <ChartBar
          startDate={localActualStartDate}
          endDate={localActualEndDate}
          dateArray={dateArray}
          isActual={true}
          entryId={entry.id}
          charge={charge}
          onBarMouseDown={handleBarMouseDown}
        />
      )}
      {localPlannedStartDate && localPlannedEndDate && (
        <ChartBar
          startDate={localPlannedStartDate}
          endDate={localPlannedEndDate}
          dateArray={dateArray}
          isActual={false}
          entryId={entry.id}
          charge={charge}
          onBarMouseDown={handleBarMouseDown}
        />
      )}
    </div>
  );
});

export default memo(GridHorizontal);