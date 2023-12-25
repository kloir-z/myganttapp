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
      const businessDays = calculateBusinessDays(startDate, endDate);
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
      chartRow.dependentId = '';
    }
    return;
  }
  visited.add(currentId);
  Object.values(state).forEach((row: WBSData) => {
    if (row.rowType === 'Chart') {
      const chartRow = row as ChartRow;
      if (chartRow.dependentId === currentId) {
        const dependency = chartRow.dependency.toLowerCase();
        if (!chartRow.dependency) {
          return;
        }
        const dependencyParts = dependency.split(',');

        let newStartDate;
        switch (dependencyParts[0]) {
          case 'after':
            // オフセット日数を取得し、依存元の終了日に加算
            let offsetDays = parseInt(dependencyParts[2], 10);
            // offsetDays が NaN または 0 以下の場合、1 に設定
            if (isNaN(offsetDays) || offsetDays <= 0) {
              offsetDays = 1;
            }
            newStartDate = addBusinessDays(newEndDate, offsetDays, false);
            break;
          case 'sameas':
            // 依存元の開始日と一致させる
            const dependentRow = state[currentId] as ChartRow;
            newStartDate = new Date(dependentRow.plannedStartDate);
            break;
          default:
            // 未知の依存関係タイプの場合は何もしない
            return;
        }

        chartRow.plannedStartDate = toLocalISOString(newStartDate);
        const dependentEndDate = addBusinessDays(newStartDate, chartRow.businessDays);
        chartRow.plannedEndDate = toLocalISOString(dependentEndDate);

        // 依存関係の更新を再帰的に行う
        updateDependentRows(state, chartRow.id, dependentEndDate, visited);
      }
    }
  });
};

export const wbsDataSlice = createSlice({
  name: 'wbsData',
  initialState,
  reducers: {
    simpleSetData: (state, action: PayloadAction<{ [id: string]: WBSData }>) => {
      const data = action.payload;
      return data;
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
              updatedChartRow.businessDays = calculateBusinessDays(newStartDate, endDate);
            }
          }
          if (newChartRow.plannedEndDate !== oldChartRow.plannedEndDate) {
            updatedChartRow.plannedEndDate = newChartRow.plannedEndDate;
            if (newChartRow.plannedStartDate) {
              const startDate = new Date(newChartRow.plannedStartDate);
              const newEndDate = new Date(newChartRow.plannedEndDate);
              updatedChartRow.businessDays = calculateBusinessDays(startDate, newEndDate);
              updateDependentRows(state, id, newEndDate);
            }
          }
          if (newChartRow.businessDays !== oldChartRow.businessDays) {
            updatedChartRow.businessDays = newChartRow.businessDays;
            if (newChartRow.plannedStartDate && newChartRow.businessDays) {
              const startDate = new Date(newChartRow.plannedStartDate);
              const businessDays = newChartRow.businessDays;
              const newEndDate = addBusinessDays(startDate, businessDays);
              updatedChartRow.plannedEndDate = toLocalISOString(newEndDate);
              updateDependentRows(state, id, newEndDate);
            } else if (newChartRow.plannedStartDate) {
              const startDate = new Date(newChartRow.plannedStartDate);
              const businessDays = 1;
              updatedChartRow.businessDays = 1;
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
          chartRow.businessDays = calculateBusinessDays(newStartDate, endDate);
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
          chartRow.businessDays = calculateBusinessDays(startDate, newEndDate);
        }
        updateDependentRows(state, id, new Date(endDate));
      }
    },
    setBusinessDays: (state, action: PayloadAction<{ id: string; days: number }>) => {
      const { id, days } = action.payload;
    
      const updateDependentRows = (currentId: string, newEndDate: Date) => {
        Object.values(state).forEach(row => {
          if (row.rowType === 'Chart') {
            const chartRow = row as ChartRow;
            if (chartRow.dependentId === currentId) {
              const dependency = chartRow.dependency?.toLowerCase();
              if (!dependency) return;
    
              const dependencyParts = dependency.split(',');
              let newStartDate;
    
              switch (dependencyParts[0]) {
                case 'after':
                  let offsetDays = parseInt(dependencyParts[2], 10);
                  if (isNaN(offsetDays) || offsetDays <= 0) {
                    offsetDays = 1;
                  }
                  newStartDate = addBusinessDays(newEndDate, offsetDays, false);
                  break;
                case 'sameas':
                  const dependentRow = state[currentId] as ChartRow;
                  newStartDate = new Date(dependentRow.plannedStartDate);
                  break;
                default:
                  return;
              }
    
              chartRow.plannedStartDate = toLocalISOString(newStartDate);
              const dependentEndDate = addBusinessDays(newStartDate, chartRow.businessDays);
              chartRow.plannedEndDate = toLocalISOString(dependentEndDate);
    
              updateDependentRows(chartRow.id, dependentEndDate);
            }
          }
        });
      };
    
      if (state[id] && state[id].rowType === 'Chart') {
        const chartRow = state[id] as ChartRow;
        chartRow.businessDays = days;
        if (chartRow.plannedStartDate && days) {
          const startDate = new Date(chartRow.plannedStartDate);
          const endDate = addBusinessDays(startDate, days);
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