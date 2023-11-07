import { useState, useRef, useEffect, useCallback } from 'react';
import { ChartRow  } from '../types/DataTypes';

interface SharedState {
    charge: string;
    displayName: string;
    plannedStartDate: Date | null;
    plannedEndDate: Date | null;
    actualStartDate: Date | null;
    actualEndDate: Date | null;
    // 他にも共有したい状態があればここに追加する
  }

export function useSharedState(entry: ChartRow): [SharedState, (newState: Partial<SharedState>) => void] {
    const [sharedState, setSharedState] = useState<SharedState>({
      charge: entry.charge,
      displayName: entry.displayName,
      plannedStartDate: entry.plannedStartDate ? new Date(entry.plannedStartDate) : null,
      plannedEndDate: entry.plannedEndDate ? new Date(entry.plannedEndDate) : null,
      actualStartDate: entry.actualStartDate ? new Date(entry.actualStartDate) : null,
      actualEndDate: entry.actualEndDate ? new Date(entry.actualEndDate) : null,
      // 他のプロパティも初期化する
    });
  
    // 更新関数
    const updateSharedState = (newState: Partial<SharedState>) => {
      setSharedState((prev) => ({ ...prev, ...newState }));
    };
  
    return [sharedState, updateSharedState];
  }