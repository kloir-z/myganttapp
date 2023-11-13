import React, { useState, memo, useEffect, useCallback, useRef } from 'react';
import { ChartRow } from '../types/DataTypes';
import { Row } from '../styles/GanttStyles';
import { MemoizedCell } from './GanttCell';
import { useSelector, useDispatch } from 'react-redux';
import { RootState} from '../reduxComponents/store';

interface ChartRowProps {
  entry: ChartRow;
  index: number;
  dateArray: Date[];
}   

const GridHorizontal: React.FC<ChartRowProps> = memo(({ entry, index, dateArray }) => {
  const dispatch = useDispatch();
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
  
  return (
    <>
        <Row
          key={index}
          data-index={index}
          style={{width: `${calendarWidth}px`}}
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
                const width = ((endIndex - startIndex + 1) * 21)+0.3;
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
              const width = ((endIndex - startIndex + 1) * 21)+0.3;
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
});

export default memo(GridHorizontal);