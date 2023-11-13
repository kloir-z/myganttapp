// hoverSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HoverState {
  hoveredDayColumnIndex: number | null;
  hoveredWbsRowIndex: number | null;
}

const initialState: HoverState = {
  hoveredDayColumnIndex: null,
  hoveredWbsRowIndex: null,
};

export const hoverSlice = createSlice({
  name: 'hover',
  initialState,
  reducers: {
    setHoveredDayColumnIndex: (state, action: PayloadAction<number | null>) => {
      state.hoveredDayColumnIndex = action.payload;
    },
    setHoveredWbsRowIndex: (state, action: PayloadAction<number | null>) => {
      state.hoveredWbsRowIndex = action.payload;
    },
  },
});

export const { setHoveredDayColumnIndex, setHoveredWbsRowIndex } = hoverSlice.actions;

export default hoverSlice.reducer;
