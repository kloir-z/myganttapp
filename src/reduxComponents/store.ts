import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WBSData, ChartRow } from '../types/DataTypes';
import { testData } from '../testdata/testdata';
import { v4 as uuidv4 } from 'uuid';
import hoverSlice from './hoverSlice';

const assignIds = (data: WBSData[]): { [id: string]: WBSData } => {
  const dataWithIdsAndNos: { [id: string]: WBSData } = {};
  data.forEach((row, index) => {
    const id = uuidv4();
    dataWithIdsAndNos[id] = { ...row, id, no: index + 1 };
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
        (state[id] as ChartRow).plannedStartDate = startDate;
      }
    },
    setPlannedEndDate: (state, action: PayloadAction<{ id: string; endDate: string }>) => {
      const { id, endDate } = action.payload;
      if (state[id] && state[id].rowType === 'Chart') {
        (state[id] as ChartRow).plannedEndDate = endDate;
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
  setActualStartDate, 
  setActualEndDate,
  setDisplayName 
} = wbsDataSlice.actions;

export const store = configureStore({
  reducer: {
    wbsData: wbsDataSlice.reducer,
    hover: hoverSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;