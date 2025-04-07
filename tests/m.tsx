import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ViewContextType {
  addView: (view: ReactNode) => void;
  views: ReactNode[];
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [views, setViews] = useState<ReactNode[]>([]);

  const addView = (view: ReactNode) => {
    setViews((prevViews) => [...prevViews, view]);
  };

  return (
    <ViewContext.Provider value={{ addView, views }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useMyComponent = () => {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error('useMyComponent must be used within a ViewProvider');
  }

  return context;
};
