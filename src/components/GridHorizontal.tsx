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
  const displayName = entry.displayName;
  const [localPlannedStartDate, setLocalPlannedStartDate] = useState(entry.plannedStartDate ? new Date(entry.plannedStartDate) : null);
  const [localPlannedEndDate, setLocalPlannedEndDate] = useState(entry.plannedEndDate ? new Date(entry.plannedEndDate) : null);
  const [localActualStartDate, setLocalActualStartDate] = useState(entry.actualStartDate ? new Date(entry.actualStartDate) : null);
  const [localActualEndDate, setLocalActualEndDate] = useState(entry.actualEndDate ? new Date(entry.actualEndDate) : null);
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
    setLocalPlannedStartDate(calculateDateFromX(relativeX));
    setLocalPlannedEndDate(calculateDateFromX(relativeX));
  };

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (!gridRect) return;
    const scrollLeft = gridRef.current?.scrollLeft || 0;
    const relativeX = event.clientX - gridRect.left + scrollLeft;
    if (!isEditing) return;
    const newDate = calculateDateFromX(relativeX);
    if (localPlannedStartDate && newDate > localPlannedStartDate) {
      setLocalPlannedEndDate(newDate);
    } else if (localPlannedEndDate) {
      setLocalPlannedStartDate(newDate);
    }
  }, [isEditing]);

  const syncToStore = useCallback(debounce(() => {
    if (isEditing) {
      if (localPlannedStartDate) {dispatch(setPlannedStartDate({ id: entry.id, startDate: localPlannedStartDate.toISOString() }));}
      if (localPlannedEndDate) {dispatch(setPlannedEndDate({ id: entry.id, endDate: localPlannedEndDate.toISOString() }));}
      if (localActualStartDate) {dispatch(setActualStartDate({ id: entry.id, startDate: localActualStartDate.toISOString() }));}
      if (localActualEndDate) {dispatch(setActualEndDate({ id: entry.id, endDate: localActualEndDate.toISOString() }));}
    }
  }, 30), [localPlannedStartDate, localPlannedEndDate, isEditing, dispatch]);

  useEffect(() => {
    if (!isEditing) {
      setLocalPlannedStartDate(entry.plannedStartDate ? new Date(entry.plannedStartDate) : null);
      setLocalPlannedEndDate(entry.plannedEndDate ? new Date(entry.plannedEndDate) : null);
      setLocalActualStartDate(entry.actualStartDate ? new Date(entry.actualStartDate) : null);
      setLocalActualEndDate(entry.actualEndDate ? new Date(entry.actualEndDate) : null);
    }
  }, [entry.plannedStartDate, entry.plannedEndDate, isEditing]);

  useEffect(() => {
    syncToStore();
    return () => syncToStore.cancel();
  }, [syncToStore]);

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
        const actualStart = new Date(localActualStartDate);
        const actualEnd = new Date(localActualEndDate);
        const startIndex = dateArray.findIndex(date => date >= actualStart);
        let endIndex = dateArray.findIndex(date => date >= actualEnd);
        endIndex = endIndex !== -1 ? endIndex : dateArray.length - 1;
        const dateArrayStart = dateArray[0];
        const dateArrayEnd = dateArray[dateArray.length - 1];
        if (actualStart > dateArrayEnd || actualEnd < dateArrayStart) {
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
                displayName={displayName}
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