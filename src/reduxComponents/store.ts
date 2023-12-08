import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WBSData, ChartRow } from '../types/DataTypes';
import { testData } from '../testdata/testdata';
import { v4 as uuidv4 } from 'uuid';
import { calculateBusinessDays, addBusinessDays, toLocalISOString } from '../utils/CalendarUtil';

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

const updateDependentRows = (
  state: { [id: string]: WBSData },
  currentId: string,
  newEndDate: Date,
  visited = new Set<string>(),
) => {
  if (visited.has(currentId)) {
    if (state[currentId] && state[currentId].rowType === 'Chart') {
      const chartRow = state[currentId] as ChartRow;
      chartRow.chain = '';
    }
    return;
  }
  visited.add(currentId);
  Object.values(state).forEach((row: WBSData) => {
    if (row.rowType === 'Chart' && (row as ChartRow).chain === currentId) {
      const dependentRow = row as ChartRow;
      const newStartDate = addBusinessDays(newEndDate, 1, false);
      dependentRow.plannedStartDate = toLocalISOString(newStartDate);
      const dependentEndDate = addBusinessDays(newStartDate, parseInt(dependentRow.businessDays));
      dependentRow.plannedEndDate = toLocalISOString(dependentEndDate);
      updateDependentRows(state, dependentRow.id, dependentEndDate, visited);
    }
  });
};

export const wbsDataSlice = createSlice({
  name: 'wbsData',
  initialState,
  reducers: {
    simpleSetData: (state, action: PayloadAction<{ [id: string]: WBSData }>) => {
      const data = action.payload;
      const idToNoMapping: { [id: string]: number } = {};
      Object.values(data).forEach(row => {
        if ('id' in row) {
          idToNoMapping[row.id] = row.no;
        }
      });
      const newData = Object.fromEntries(
        Object.entries(data).map(([id, row]) => {
          if (row.rowType === "Chart") {
            const chainNo = row.chain in idToNoMapping ? idToNoMapping[row.chain].toString() : '';
            return [id, { ...row, chainNo }];
          }
          return [id, row];
        })
      );
      return newData;
    },
    setData: (state, action: PayloadAction<{ [id: string]: WBSData }>) => {
      const newData = action.payload;
    
      Object.keys(newData).forEach(id => {
        const newRow = newData[id];
        if (newRow.rowType === 'Chart') {
          const newChartRow = newRow as ChartRow;
          const oldChartRow = state[id] as ChartRow;
          const updatedChartRow = { ...oldChartRow, ...newChartRow };
          if (newChartRow.plannedStartDate !== oldChartRow.plannedStartDate) {
            updatedChartRow.plannedStartDate = newChartRow.plannedStartDate;
            if (newChartRow.plannedEndDate) {
              const newStartDate = new Date(newChartRow.plannedStartDate);
              const endDate = new Date(newChartRow.plannedEndDate);
              updatedChartRow.businessDays = calculateBusinessDays(newStartDate, endDate).toString();
            }
          }
          if (newChartRow.plannedEndDate !== oldChartRow.plannedEndDate) {
            updatedChartRow.plannedEndDate = newChartRow.plannedEndDate;
            if (newChartRow.plannedStartDate) {
              const startDate = new Date(newChartRow.plannedStartDate);
              const newEndDate = new Date(newChartRow.plannedEndDate);
              updatedChartRow.businessDays = calculateBusinessDays(startDate, newEndDate).toString();
              updateDependentRows(state, id, newEndDate);
            }
          }
          if (newChartRow.businessDays !== oldChartRow.businessDays) {
            updatedChartRow.businessDays = newChartRow.businessDays;
            if (newChartRow.plannedStartDate && newChartRow.businessDays) {
              const startDate = new Date(newChartRow.plannedStartDate);
              const businessDays = parseInt(newChartRow.businessDays, 10);
              const newEndDate = addBusinessDays(startDate, businessDays);
              updatedChartRow.plannedEndDate = toLocalISOString(newEndDate);
              updateDependentRows(state, id, newEndDate);
            }
          }
          state[id] = updatedChartRow;
        }
      });
      Object.keys(state).forEach(id => {
        const row = state[id];
        if (row.rowType === 'Chart') {
          const chartRow = row as ChartRow;
          if (chartRow.plannedEndDate) {
            const newEndDate = new Date(chartRow.plannedEndDate);
            updateDependentRows(state, id, newEndDate);
          }
        }
      });
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
        updateDependentRows(state, id, new Date(endDate));
      }
    },
    setBusinessDays: (state, action: PayloadAction<{ id: string; days: string }>) => {
      const { id, days } = action.payload;
      const updateDependentRows = (currentId: string, newEndDate: Date) => {
        Object.values(state).forEach(row => {
          if (row.rowType === 'Chart' && (row as ChartRow).chain === currentId) {
            const dependentRow = row as ChartRow;
            const newStartDate = addBusinessDays(newEndDate, 1, false);
            dependentRow.plannedStartDate = toLocalISOString(newStartDate);
            const dependentEndDate = addBusinessDays(newStartDate, parseInt(dependentRow.businessDays));
            dependentRow.plannedEndDate = toLocalISOString(dependentEndDate);
            updateDependentRows(dependentRow.id, dependentEndDate);
          }
        });
      };
      if (state[id] && state[id].rowType === 'Chart') {
        const chartRow = state[id] as ChartRow;
        chartRow.businessDays = days;
        if (chartRow.plannedStartDate && days) {
          const startDate = new Date(chartRow.plannedStartDate);
          const businessDays = parseInt(days, 10);
          const endDate = addBusinessDays(startDate, businessDays);
          updateDependentRows(id, new Date(endDate));
        }
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
  },
});

export const {
  simpleSetData,
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