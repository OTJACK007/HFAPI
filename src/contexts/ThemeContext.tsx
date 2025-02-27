import React, { createContext, useContext, useState, ReactNode } from 'react';
import { KYCThemeConfig, defaultKYCTheme, mergeWithDefaultKYCTheme } from '../config/KYCTheme';
import { KYBThemeConfig, defaultKYBTheme, mergeWithDefaultKYBTheme } from '../config/KYBTheme';

interface ThemeContextType {
  kycTheme: KYCThemeConfig;
  kybTheme: KYBThemeConfig;
  setKYCTheme: (theme: Partial<KYCThemeConfig>) => void;
  setKYBTheme: (theme: Partial<KYBThemeConfig>) => void;
  resetKYCTheme: () => void;
  resetKYBTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  kycTheme: defaultKYCTheme,
  kybTheme: defaultKYBTheme,
  setKYCTheme: () => {},
  setKYBTheme: () => {},
  resetKYCTheme: () => {},
  resetKYBTheme: () => {}
});

interface ThemeProviderProps {
  children: ReactNode;
  initialKYCTheme?: Partial<KYCThemeConfig>;
  initialKYBTheme?: Partial<KYBThemeConfig>;
}

export const ThemeProvider = ({ 
  children, 
  initialKYCTheme, 
  initialKYBTheme 
}: ThemeProviderProps) => {
  const [kycTheme, setKYCThemeState] = useState<KYCThemeConfig>(
    initialKYCTheme ? mergeWithDefaultKYCTheme(initialKYCTheme) : defaultKYCTheme
  );
  
  const [kybTheme, setKYBThemeState] = useState<KYBThemeConfig>(
    initialKYBTheme ? mergeWithDefaultKYBTheme(initialKYBTheme) : defaultKYBTheme
  );

  // Mettre à jour le thème KYC
  const setKYCTheme = (theme: Partial<KYCThemeConfig>) => {
    setKYCThemeState(currentTheme => ({
      ...currentTheme,
      ...theme,
      colors: {
        ...currentTheme.colors,
        ...(theme.colors || {})
      },
      borderRadius: {
        ...currentTheme.borderRadius,
        ...(theme.borderRadius || {})
      },
      shadows: {
        ...currentTheme.shadows,
        ...(theme.shadows || {})
      }
    }));
  };

  // Mettre à jour le thème KYB
  const setKYBTheme = (theme: Partial<KYBThemeConfig>) => {
    setKYBThemeState(currentTheme => ({
      ...currentTheme,
      ...theme,
      colors: {
        ...currentTheme.colors,
        ...(theme.colors || {})
      },
      borderRadius: {
        ...currentTheme.borderRadius,
        ...(theme.borderRadius || {})
      },
      shadows: {
        ...currentTheme.shadows,
        ...(theme.shadows || {})
      }
    }));
  };

  // Réinitialiser au thème KYC par défaut
  const resetKYCTheme = () => {
    setKYCThemeState(defaultKYCTheme);
  };

  // Réinitialiser au thème KYB par défaut
  const resetKYBTheme = () => {
    setKYBThemeState(defaultKYBTheme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        kycTheme, 
        kybTheme, 
        setKYCTheme, 
        setKYBTheme, 
        resetKYCTheme, 
        resetKYBTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le contexte de thème
export const useThemeContext = () => useContext(ThemeContext);