import React, { useState, memo, useEffect, useCallback, useRef } from 'react';
import { ChartRow } from '../types/DataTypes';
import { Row } from '../styles/GanttStyles';
import { MemoizedCell } from './GanttCell';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPlannedStartDate, setPlannedEndDate, setActualStartDate, setActualEndDate, setCharge, setDisplayName} from '../reduxComponents/store';

interface ChartRowProps {
  entry: ChartRow;
  index: number;
  dateArray: Date[];
  wbsWidth: number;
  gridRef: React.RefObject<HTMLDivElement>;
}   

const GridHorizontal: React.FC<ChartRowProps> = ({ entry, index, dateArray, wbsWidth, gridRef }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditActual, setIsEditActual] = useState(false);
  const relativeXRef = useRef(0);
  const calendarWidth = dateArray.length * 21;
  const row = useSelector((state: RootState) => state.wbsData[entry.id]);
  const charge = (row && 'charge' in row) ? row.charge : '';
  const displayName = row?.displayName ?? '';
  
  const plannedStartDateString = useSelector((state: RootState) => {
    const row = state.wbsData[entry.id];
    if (row.rowType === 'Chart' || row.rowType === 'Event') {
      // EventRowの場合はeventDataの最初の要素を参照するか、適切なロジックをここに書く
      return row.rowType === 'Event' ? row.eventData[0].plannedStartDate : row.plannedStartDate;
    }
    return null;
  });
  
  const plannedEndDateString = useSelector((state: RootState) => {
    const row = state.wbsData[entry.id];
    if (row.rowType === 'Chart' || row.rowType === 'Event') {
      // EventRowの場合はeventDataの最初の要素を参照するか、適切なロジックをここに書く
      return row.rowType === 'Event' ? row.eventData[0].plannedEndDate : row.plannedEndDate;
    }
    return null;
  });

  const actualStartDateString = useSelector((state: RootState) => {
    const row = state.wbsData[entry.id];
    if (row.rowType === 'Chart' || row.rowType === 'Event') {
      // EventRowの場合はeventDataの最初の要素を参照するか、適切なロジックをここに書く
      return row.rowType === 'Event' ? row.eventData[0].actualStartDate : row.actualStartDate;
    }
    return null;
  });
  
  const actualEndDateString = useSelector((state: RootState) => {
    const row = state.wbsData[entry.id];
    if (row.rowType === 'Chart' || row.rowType === 'Event') {
      // EventRowの場合はeventDataの最初の要素を参照するか、適切なロジックをここに書く
      return row.rowType === 'Event' ? row.eventData[0].actualEndDate : row.actualEndDate;
    }
    return null;
  });
  
  const plannedStartDate = plannedStartDateString ? new Date(plannedStartDateString) : null;
  const plannedEndDate = plannedEndDateString ? new Date(plannedEndDateString) : null;
  const actualStartDate = actualStartDateString ? new Date(actualStartDateString) : null;
  const actualEndDate = actualEndDateString ? new Date(actualEndDateString) : null;

  const calculateDateFromX = (x: number) => {
    const dateIndex = Math.floor(x / 21);
    return dateArray[dateIndex];
  };
  
  const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();  
    const relativeX = event.clientX - rect.left;
    const newDate = calculateDateFromX(relativeX).toISOString().substring(0, 10);

    if (event.shiftKey) {
      setIsEditing(false);
      setIsEditActual(true);
      dispatch(setActualStartDate({ id: entry.id, startDate: newDate }));
      dispatch(setActualEndDate({ id: entry.id, endDate: newDate }));
    } else {
      setIsEditing(true);
      setIsEditActual(false);
      dispatch(setPlannedStartDate({ id: entry.id, startDate: newDate }));
      dispatch(setPlannedEndDate({ id: entry.id, endDate: newDate }));
    }
  }, [dispatch, calculateDateFromX, entry.id]);

  useEffect(() => {
    console.log(`${isEditing}, ${isEditActual}`)
  }, [isEditing, isEditActual]);


  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollX = gridRef.current ? gridRef.current.scrollLeft : 0;
    let relativeX = event.clientX - rect.left + scrollX;
    relativeX = Math.floor((relativeX - wbsWidth) / 21) * 21;
    const currentCol = Math.floor(relativeX / 21);
    const prevCol = Math.floor(relativeXRef.current / 21);
  
    if (currentCol === prevCol) return;
    if (!isEditing && !isEditActual) return;

    const newDateObject = calculateDateFromX(relativeX);
    if (!newDateObject) return;
  
    const newDate = calculateDateFromX(relativeX).toISOString().substring(0, 10);
    if (isEditActual) {
      if (actualStartDate && new Date(newDate) >= actualStartDate) {
        dispatch(setActualEndDate({ id: entry.id, endDate: newDate }));
      } else if (actualEndDate) {
        dispatch(setActualStartDate({ id: entry.id, startDate: newDate }));
      }
    } else {
      if (plannedStartDate && new Date(newDate) >= plannedStartDate) {
        dispatch(setPlannedEndDate({ id: entry.id, endDate: newDate }));
      } else if (plannedEndDate) {
        dispatch(setPlannedStartDate({ id: entry.id, startDate: newDate }));
      }
    }
    relativeXRef.current = relativeX;
  }, [isEditing, isEditActual, dispatch, calculateDateFromX, entry.id, plannedStartDate, plannedEndDate, actualStartDate, actualEndDate, wbsWidth, gridRef]);

  const handleMouseUp = useCallback(() => {
    setIsEditing(false);
    setIsEditActual(false);
  }, []);
  
  return (
    <>
      {(isEditing || isEditActual) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw', 
            height: '100vh',
            zIndex: 2,
            cursor: 'pointer'
          }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseUp}
        />
      )}
      {/* チャート部分 */}
        <Row
          key={index}
          onDoubleClick={handleDoubleClick}
          className="wbsRow"
          style={{height: '20px', width: `${calendarWidth}px`}}
        >
          {plannedStartDate && plannedEndDate ? (() => {
              const startIndex = dateArray.findIndex(date => date >= plannedStartDate);
              let endIndex = dateArray.findIndex(date => date >= plannedEndDate);
              endIndex = endIndex !== -1 ? endIndex : dateArray.length - 1; 
              const dateArrayStart = dateArray[0];
              const dateArrayEnd = dateArray[dateArray.length - 1];
        
              if (plannedStartDate > dateArrayEnd || plannedEndDate < dateArrayStart) {
                return null;
              }
              if (startIndex !== -1 && endIndex !== -1) {
                const width = (endIndex - startIndex + 1) * 21;
                const leftPosition = startIndex * 21;

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
          {actualStartDate && actualEndDate ? (() => {
            const startIndex = dateArray.findIndex(date => date >= actualStartDate);
            let endIndex = dateArray.findIndex(date => date >= actualEndDate);
            endIndex = endIndex !== -1 ? endIndex : dateArray.length - 1;
            const dateArrayStart = dateArray[0];
            const dateArrayEnd = dateArray[dateArray.length - 1];

            // StartDateまたはEndDateがdateArray範囲外である場合はnullを返す
            if (actualStartDate > dateArrayEnd || actualEndDate < dateArrayStart) {
              return null;
            }

            // startIndex と endIndex が有効範囲内にあるかチェックする
            if (startIndex !== -1 && endIndex !== -1) {
              const width = (endIndex - startIndex + 1) * 21;
              const leftPosition = startIndex * 21;

              return (
                <div
                  style={{
                    position: 'absolute',
                    left: `${leftPosition}px`,
                    width: `${width}px`
                  }}
                >
                  <MemoizedCell
                    isActual={true}
                    width={width}
                  />
                </div>
              );
            }
            return null;
          })() : null}
        </Row>
    </>
  );
};

export default memo(GridHorizontal);