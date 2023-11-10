// WBSDataSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WBSData } from '../types/DataTypes';
import { testData } from '../testdata/testdata';

interface WBSDataState {
  data: WBSData[];
}

// 初期状態にテストデータを設定する
const initialState: WBSDataState = {
  data: testData,
};

export const wbsDataSlice = createSlice({
  name: 'wbsData',
  initialState,
  reducers: {
    // データをロードするためのアクション
    loadData(state, action: PayloadAction<WBSData[]>) {
      state.data = action.payload;
    },
    // 他の行の状態を更新するアクション
    // ...
  },
});

export const { loadData } = wbsDataSlice.actions;

export default wbsDataSlice.reducer;
