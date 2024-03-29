// EventRowComponent.tsx
import React, { useState, memo, useEffect, useCallback  } from 'react';
import { EventRow } from '../types/DataTypes';
import { useDispatch } from 'react-redux';
import { updateEventRow } from '../reduxComponents/store';
import { debounce } from 'lodash';
import { formatDate, adjustToLocalMidnight } from '../utils/chartHelpers'; 
import ChartBar from './ChartBar';
import ChartBarContextMenu from './ChartBarContextMenu';
import { convertAliasToChartBarColor } from '../types/colorAliasMapping';
import { AliasMapping } from "../types/colorAliasMapping";

interface EventRowProps {
  entry: EventRow;
  dateArray: Date[];
  gridRef: React.RefObject<HTMLDivElement>;
  setCanDrag: (canDrag: boolean) => void;
  aliasMapping: AliasMapping;
}

const EventRowComponent: React.FC<EventRowProps> = memo(({ entry, dateArray, gridRef, setCanDrag, aliasMapping }) => {
  const dispatch = useDispatch();
  const chartBarColor = convertAliasToChartBarColor(entry.color, aliasMapping) || 'green';
  const [localEvents, setLocalEvents] = useState(entry.eventData.map(event => ({
    ...event,
    startDate: event.startDate ? new Date(event.startDate) : null,
    endDate: event.endDate ? new Date(event.endDate) : null,
    isPlanned: event.isPlanned,
    eachDisplayName: event.eachDisplayName
  })));  
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isBarDragging, setIsBarDragging] = useState(false);
  const [isBarEndDragging, setIsBarEndDragging] = useState(false);
  const [originalStartDate, setOriginalStartDate] = useState<Date | null>(null);
  const [originalEndDate, setOriginalEndDate] = useState<Date | null>(null);
  const [initialMouseX, setInitialMouseX] = useState<number | null>(null);
  const [activeEventIndex, setActiveEventIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, index: number } | null>(null);

  const handleBarMouseDown = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    setIsBarDragging(true);
    setInitialMouseX(event.clientX);
    setOriginalStartDate(localEvents[index].startDate);
    setOriginalEndDate(localEvents[index].endDate);
    setActiveEventIndex(index);
  };
  
  const handleBarEndMouseDown = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    setIsBarEndDragging(true);
    setInitialMouseX(event.clientX);
    setOriginalStartDate(localEvents[index].startDate);
    setOriginalEndDate(localEvents[index].endDate);
    setActiveEventIndex(index); 
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
    const newEvent = {
      startDate: clickedDate,
      endDate: clickedDate,
      isPlanned: !isShiftKeyDown,
      eachDisplayName: ""
    };
    setLocalEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      setActiveEventIndex(updatedEvents.length - 1);
      return updatedEvents;
    });  }

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if ((isBarDragging || isBarEndDragging) && initialMouseX !== null && activeEventIndex !== null) {
      const currentMouseX = event.clientX;
      const deltaX = currentMouseX - initialMouseX;
      const gridSteps = Math.floor(deltaX / 21);
  
      setLocalEvents((prevEvents) => {
        return prevEvents.map((event, index) => {
          if (index === activeEventIndex) {
            let newStartDate = event.startDate;
            let newEndDate = event.endDate;
  
            if (isBarDragging && originalStartDate && originalEndDate) {
              newStartDate = new Date(originalStartDate.getTime());
              newStartDate.setDate(newStartDate.getDate() + gridSteps);
              newEndDate = new Date(originalEndDate.getTime());
              newEndDate.setDate(newEndDate.getDate() + gridSteps);
            } else if (isBarEndDragging && originalStartDate && originalEndDate) {
              newEndDate = new Date(originalEndDate.getTime());
              newEndDate.setDate(newEndDate.getDate() + gridSteps);
              if (newEndDate < originalStartDate) {
                newEndDate.setDate(originalStartDate.getDate());
              }
            }
  
            return {
              ...event,
              startDate: newStartDate,
              endDate: newEndDate
            };
          }
          return event;
        });
      });
    } else if (isEditing) {
      const gridRect = gridRef.current?.getBoundingClientRect();
      if (!gridRect || !currentDate || activeEventIndex === null) return;
  
      const scrollLeft = gridRef.current?.scrollLeft || 0;
      const relativeX = event.clientX - gridRect.left + scrollLeft;
      const newDate = calculateDateFromX(relativeX);
  
      const isEndDate = newDate > currentDate;
      const newStartDate = (isEndDate ? currentDate : newDate);
      const newEndDate = (isEndDate ? newDate : currentDate);
      setLocalEvents(prevEvents => {
        return prevEvents.map((event, index) => {
          if (index === activeEventIndex) {
            return {
              ...event,
              startDate: newStartDate,
              endDate: newEndDate
            };
          }
          return event;
        });
      });
    }
  }, [isBarDragging, isBarEndDragging, initialMouseX, activeEventIndex, isEditing, originalStartDate, originalEndDate, gridRef, currentDate, calculateDateFromX]);
      
  useEffect(() => {
    if (!isEditing && !isBarDragging && !isBarEndDragging) {
      setLocalEvents(entry.eventData.map(event => ({
        ...event,
        startDate: event.startDate ? new Date(event.startDate) : null,
        endDate: event.endDate ? new Date(event.endDate) : null,
      })));
    }
  }, [entry.eventData, isEditing, isBarDragging, isBarEndDragging]);  

  const syncToStore = useCallback(() => {
    if (isEditing || isBarDragging || isBarEndDragging) {
      const updatedEventData = localEvents.map(event => ({
        ...event,
        startDate: event.startDate ? formatDate(event.startDate) : "",
        endDate: event.endDate ? formatDate(event.endDate) : ""
      }));
  
      const updatedEventRow = {
        ...entry,
        eventData: updatedEventData
      };
  
      dispatch(updateEventRow({ id: entry.id, updatedEventRow }));
    }
  }, [isEditing, isBarDragging, isBarEndDragging, localEvents, entry, dispatch]);
  
  const debouncedSyncToStore = debounce(syncToStore, 20);
  
  useEffect(() => {
    debouncedSyncToStore();
    return () => debouncedSyncToStore.cancel();
  }, [debouncedSyncToStore]);  

  const handleMouseUp = () => {
    setIsEditing(false);
    setIsBarDragging(false);
    setIsBarEndDragging(false);
    setInitialMouseX(null);
    syncToStore();
  };

  useEffect(() => {
    if (isBarDragging || isBarEndDragging) {
      setCanDrag(false);
    } else {
      setCanDrag(true);
    }
  }, [isBarDragging, isBarEndDragging, setCanDrag]);

  const handleBarRightClick = useCallback((event: React.MouseEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, index });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleDeleteBar = useCallback(() => {
    if (contextMenu !== null) {
      setLocalEvents(prevEvents => {
        const updatedEvents = prevEvents.filter((_, idx) => idx !== contextMenu.index);
  
        // Redux storeを更新
        const updatedEventData = updatedEvents.map(event => ({
          ...event,
          startDate: event.startDate ? formatDate(event.startDate) : "",
          endDate: event.endDate ? formatDate(event.endDate) : ""
        }));
        const updatedEventRow = {
          ...entry,
          eventData: updatedEventData
        };
        dispatch(updateEventRow({ id: entry.id, updatedEventRow }));
  
        return updatedEvents;
      });
      handleCloseContextMenu();
    }
  }, [contextMenu, handleCloseContextMenu, dispatch, entry]);
  

  return (
    <div style={{position: 'absolute', height: '21px', width: `${calendarWidth}px`}} onDoubleClick={handleDoubleClick}>
      {(isEditing || isBarDragging || isBarEndDragging) && (
        <div
          style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: 'calc(100vh - 12px)', zIndex: 9999, cursor: 'pointer'}}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}
      {localEvents.map((event, index) => (
        <ChartBar
          key={index}
          startDate={event.startDate ? new Date(event.startDate) : null}
          endDate={event.endDate ? new Date(event.endDate) : null}
          dateArray={dateArray}
          isActual={!event.isPlanned}
          entryId={entry.id}
          eventIndex={index}
          chartBarColor={chartBarColor}
          onBarMouseDown={(e) => handleBarMouseDown(e, index)}
          onBarEndMouseDown={(e) => handleBarEndMouseDown(e, index)}
          onContextMenu={(e) => handleBarRightClick(e, index)}
        />
      ))}
      {contextMenu && (
        <ChartBarContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onDelete={handleDeleteBar}
        />
      )}
    </div>
  );
});

export default memo(EventRowComponent);