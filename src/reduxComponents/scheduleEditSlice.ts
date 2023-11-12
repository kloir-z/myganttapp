import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScheduleEditState {
  isEditingPlannedDate: boolean;
  isEditingActualDate: boolean;
  entryId: string | null;
}

const initialState: ScheduleEditState = {
  isEditingPlannedDate: false,
  isEditingActualDate: false,
  entryId: null,
};

export const scheduleEditSlice = createSlice({
  name: 'scheduleEdit',
  initialState,
  reducers: {
    startEditingPlannedDate: (state, action: PayloadAction<{ entryId: string }>) => {
      state.isEditingPlannedDate = true;
      state.isEditingActualDate = false;
      state.entryId = action.payload.entryId;
    },
    stopEditingPlannedDate: (state) => {
      state.isEditingPlannedDate = false;
      state.isEditingActualDate = false;
      state.entryId = null;
    },
    startEditingActualDate: (state, action: PayloadAction<{ entryId: string }>) => {
      state.isEditingPlannedDate = false;
      state.isEditingActualDate = true;
      state.entryId = action.payload.entryId;
    },
    stopEditingActualDate: (state) => {
      state.isEditingPlannedDate = false;
      state.isEditingActualDate = false;
      state.entryId = null;
    },
    // 他の必要なアクションを追加...
  },
});

export const { 
  startEditingPlannedDate, 
  stopEditingPlannedDate, 
  startEditingActualDate, 
  stopEditingActualDate 
  // 他のエクスポートされたアクション...
} = scheduleEditSlice.actions;

export default scheduleEditSlice.reducer;
