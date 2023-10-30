// WBSDataContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WBSData } from '../types/DataTypes';
import { testData } from '../testdata/testdata';

type WBSDataContextType = {
  data: WBSData[];
  setData: React.Dispatch<React.SetStateAction<WBSData[]>>;
};

const WBSDataContext = createContext<WBSDataContextType | null>(null);

interface WBSDataProviderProps {
  children: ReactNode;
}

export const useWBSData = () => {
  const context = useContext(WBSDataContext);
  if (!context) {
    throw new Error("useWBSData must be used within a WBSDataProvider");
  }
  return context;
};

export const WBSDataProvider: React.FC<WBSDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<WBSData[]>(testData);

  return (
    <WBSDataContext.Provider value={{ data, setData }}>
      {children}
    </WBSDataContext.Provider>
  );
};