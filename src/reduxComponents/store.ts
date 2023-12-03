import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WBSData, ChartRow } from '../types/DataTypes';
import { testData } from '../testdata/testdata';
import { v4 as uuidv4 } from 'uuid';
import { calculateBusinessDays } from '../utils/CalendarUtil';

const assignIds = (data: WBSData[]): { [id: string]: WBSData } => {
  const dataWithIdsAndNos: { [id: string]: WBSData } = {};
  data.forEach((row, index) => {
    const id = uuidv4();
    if (row.rowType === 'Chart') {
      const chartRow = row as ChartRow;
      const startDate = new Date(chartRow.plannedStartDate);
      const endDate = new Date(chartRow.plannedEndDate);
      const businessDays = calculateBusinessDays(startDate, endDate).toString();
      dataWithIdsAndNos[id] = { ...chartRow, id, no: index + 1, businessDays };
    } else {
      dataWithIdsAndNos[id] = { ...row, id, no: index + 1 };
    }
  });
  return dataWithIdsAndNos;
};

const initialState: { [id: string]: WBSData } = assignIds(testData);

export const wbsDataSlice = createSlice({
  name: 'wbsData',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<{ [id: string]: WBSData }>) => {
      return action.payload;
    },
    setPlannedStartDate: (state, action: PayloadAction<{ id: string; startDate: string }>) => {
      const { id, startDate } = action.payload;
      if (state[id] && state[id].rowType === 'Chart') {
        const chartRow = state[id] as ChartRow;
        chartRow.plannedStartDate = startDate;
        if (chartRow.plannedEndDate) {
          const newStartDate = new Date(startDate);
          const endDate = new Date(chartRow.plannedEndDate);
          chartRow.businessDays = calculateBusinessDays(newStartDate, endDate).toString();
        }
      }
    },
    setPlannedEndDate: (state, action: PayloadAction<{ id: string; endDate: string }>) => {
      const { id, endDate } = action.payload;
      if (state[id] && state[id].rowType === 'Chart') {
        const chartRow = state[id] as ChartRow;
        chartRow.plannedEndDate = endDate;
        if (chartRow.plannedStartDate) {
          const startDate = new Date(chartRow.plannedStartDate);
          const newEndDate = new Date(endDate);
          chartRow.businessDays = calculateBusinessDays(startDate, newEndDate).toString();
        }
      }
    },
    setBusinessDays: (state, action: PayloadAction<{ id: string; days: string }>) => {
      const { id, days } = action.payload;
      if (state[id] && state[id].rowType === 'Chart') {
        (state[id] as ChartRow).businessDays = days;
      }
    },
    setActualStartDate: (state, action: PayloadAction<{ id: string; startDate: string }>) => {
      const { id, startDate } = action.payload;
      if (state[id] && state[id].rowType === 'Chart') {
        (state[id] as ChartRow).actualStartDate = startDate;
      }
    },
    setActualEndDate: (state, action: PayloadAction<{ id: string; endDate: string }>) => {
      const { id, endDate } = action.payload;
      if (state[id] && state[id].rowType === 'Chart') {
        (state[id] as ChartRow).actualEndDate = endDate;
      }
    },
    setDisplayName: (state, action: PayloadAction<{ id: string; displayName: string }>) => {
      const { id, displayName } = action.payload;
      if (state[id]) {
        state[id].displayName = displayName;
      }
    },
    // 他のreducersをここに追加できます...
  },
});

export const { 
  setData, 
  setPlannedStartDate, 
  setPlannedEndDate,
  setBusinessDays,
  setActualStartDate, 
  setActualEndDate,
  setDisplayName 
} = wbsDataSlice.actions;

export const store = configureStore({
  reducer: {
    wbsData: wbsDataSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;