import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CameraContextType {
  isFullscreenActive: boolean;
  setFullscreenActive: (active: boolean) => void;
}

const CameraContext = createContext<CameraContextType>({
  isFullscreenActive: false,
  setFullscreenActive: () => {},
});

export const useCameraContext = () => useContext(CameraContext);

interface CameraProviderProps {
  children: ReactNode;
}

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [isFullscreenActive, setFullscreenActive] = useState(false);

  return (
    <CameraContext.Provider value={{ isFullscreenActive, setFullscreenActive }}>
      {children}
    </CameraContext.Provider>
  );
};