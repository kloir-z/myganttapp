import React, { useState, memo, useEffect, useCallback, useRef } from 'react';
import { ChartRow } from '../types/DataTypes';
import { Row } from '../styles/GanttStyles';
import { MemoizedCell } from './GanttCell';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPlannedStartDate, setPlannedEndDate } from '../reduxComponents/store';

interface ChartRowProps {
  entry: ChartRow;
  index: number;
  dateArray: Date[];
  wbsWidth: number;
  gridRef: React.RefObject<HTMLDivElement>;
}   

const GridHorizontal: React.FC<ChartRowProps> = ({ entry, index, dateArray, wbsWidth, gridRef }) => {
  const dispatch = useDispatch();
  const [charge, setCharge] = useState(entry.charge);
  const [displayName, setDisplayName] = useState(entry.displayName);
  const [isEditing, setIsEditing] = useState(false);
  const relativeXRef = useRef(0);
  const calendarWidth = dateArray.length * 21;
  
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

  const plannedStartDate = plannedStartDateString ? new Date(plannedStartDateString) : null;
  const plannedEndDate = plannedEndDateString ? new Date(plannedEndDateString) : null;

  const calculateDateFromX = (x: number) => {
    const dateIndex = Math.floor(x / 21);
    return dateArray[dateIndex];
  };
  
  const handleDoubleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();  
    const relativeX = event.clientX - rect.left;
    setIsEditing(true);
    
    // 新しく計算された日付をReduxのアクションにディスパッチします
    const newDate = calculateDateFromX(relativeX).toISOString().substring(0, 10);
    dispatch(setPlannedStartDate({ id: entry.id, startDate: newDate }));
    dispatch(setPlannedEndDate({ id: entry.id, endDate: newDate }));
  }, [dispatch, calculateDateFromX, entry.id, wbsWidth]);
    
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollX = gridRef.current ? gridRef.current.scrollLeft : 0;
    let relativeX = event.clientX - rect.left + scrollX;
    relativeX = Math.floor((relativeX - wbsWidth) / 21) * 21;
    const currentCol = Math.floor(relativeX / 21);
    const prevCol = Math.floor(relativeXRef.current / 21);
  
    if (currentCol === prevCol) return;
    if (!isEditing) return;
    
    // 新しく計算された日付をReduxのアクションにディスパッチします
    const newDate = calculateDateFromX(relativeX).toISOString().substring(0, 10);
    if (plannedStartDate && new Date(newDate) >= plannedStartDate) {
      dispatch(setPlannedEndDate({ id: entry.id, endDate: newDate }));
    } else if (plannedEndDate) {
      dispatch(setPlannedStartDate({ id: entry.id, startDate: newDate }));
    }
    relativeXRef.current = relativeX;
  }, [isEditing, dispatch, calculateDateFromX, entry.id, plannedStartDate, plannedEndDate, wbsWidth, gridRef]);
  
  return (
    <>
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw', 
            height: '100vh',
            zIndex: 1,
            cursor: 'pointer'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsEditing(false)}
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
        
              // StartDateまたはEndDateがdateArray範囲外である場合はnullを返す
              if (plannedStartDate > dateArrayEnd || plannedEndDate < dateArrayStart) {
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
    </>
  );
};

export default memo(GridHorizontal);