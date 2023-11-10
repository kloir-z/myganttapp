import React, { useState, memo, useEffect } from 'react';
import { ChartRow } from '../types/DataTypes';
import { Row, InputBox } from '../styles/GanttStyles';
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setPlannedStartDate, setPlannedEndDate } from '../reduxComponents/store';

interface ChartRowProps {
  entry: ChartRow;
  index: number;
  wbsWidth: number;
}

const WBSInfo: React.FC<ChartRowProps> = ({ entry, index, wbsWidth }) => {
  const dispatch = useDispatch();
  const [majorCategory, setMajorCategory] = useState(entry.majorCategory);
  const [middleCategory, setMiddleCategory] = useState(entry.middleCategory);
  const [subCategory, setSubCategory] = useState(entry.subCategory);
  const [task, setTask] = useState(entry.task);
  const [charge, setCharge] = useState(entry.charge);
  const [estimatedDaysRequired, setEstimatedDaysRequired] = useState(entry.estimatedDaysRequired);
  const [actualStartDate, setActualStartDate] = useState(entry.actualStartDate ? new Date(entry.actualStartDate) : null);
  const [actualEndDate, setActualEndDate] = useState(entry.actualEndDate ? new Date(entry.actualEndDate) : null);
  
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

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
  
    // タイムゾーンのオフセットを取得（ミリ秒単位）
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
  
    // 開始日と終了日を適切なISO文字列に変換
    const startIsoString = start ? new Date(start.getTime() - timezoneOffset).toISOString().substring(0, 10) : '';
    const endIsoString = end ? new Date(end.getTime() - timezoneOffset).toISOString().substring(0, 10) : '';
  
    if (start) {
      dispatch(setPlannedStartDate({ id: entry.id, startDate: startIsoString }));
      // 開始日が選択されたが終了日はまだ選択されていない場合、終了日をクリア
      if (!end) {
        dispatch(setPlannedEndDate({ id: entry.id, endDate: '' }));
      }
    }
    if (end) {
      dispatch(setPlannedEndDate({ id: entry.id, endDate: endIsoString }));
    }
  };

  return (
    <>
      <Row
        key={index}
        className="wbsRow"
        style={{height: '20px', width: `${wbsWidth}px`}}
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
          onChange={handleDateChange}
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
      </Row>
    </>
  );
};

export default memo(WBSInfo);