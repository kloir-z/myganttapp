import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WBSData, ChartRow } from '../types/DataTypes';
import { testData } from '../testdata/testdata';
import { v4 as uuidv4 } from 'uuid';

const assignIds = (data: WBSData[]): { [id: string]: WBSData } => {
  const dataWithIds: { [id: string]: WBSData } = {}; // 正しい型を使用
  data.forEach((row) => {
    const id = uuidv4(); // UUIDを生成
    dataWithIds[id] = { ...row, id }; // 新しいIDでマップを作成
  });
  return dataWithIds;
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
    // 他のreducersをここに追加できます...
  },
});

export const { setData, setPlannedStartDate, setPlannedEndDate } = wbsDataSlice.actions;

// Create the store
export const store = configureStore({
  reducer: {
    wbsData: wbsDataSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
