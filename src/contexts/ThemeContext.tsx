import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { KYCThemeConfig, defaultKYCTheme, mergeWithDefaultKYCTheme, blueKYCTheme, lightKYCTheme } from '../config/KYCTheme';
import { KYBThemeConfig, defaultKYBTheme, mergeWithDefaultKYBTheme, enterpriseKYBTheme, lightKYBTheme as lightKYBTheme } from '../config/KYBTheme';

interface ThemeContextType {
  kycTheme: KYCThemeConfig;
  kybTheme: KYBThemeConfig;
  setKYCTheme: (theme: Partial<KYCThemeConfig>) => void;
  setKYBTheme: (theme: Partial<KYBThemeConfig>) => void;
  resetKYCTheme: () => void;
  resetKYBTheme: () => void;
  applyKYCTheme: (themeName: string) => void;
  applyKYBTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  kycTheme: defaultKYCTheme,
  kybTheme: defaultKYBTheme,
  setKYCTheme: () => {},
  setKYBTheme: () => {},
  resetKYCTheme: () => {},
  resetKYBTheme: () => {},
  applyKYCTheme: () => {},
  applyKYBTheme: () => {}
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
  // Utiliser directement les thèmes par défaut des fichiers de configuration
  const [kycTheme, setKYCThemeState] = useState<KYCThemeConfig>(defaultKYCTheme);
  const [kybTheme, setKYBThemeState] = useState<KYBThemeConfig>(defaultKYBTheme);

  // Force un rafraîchissement de l'interface lors du chargement
  useEffect(() => {
    // Appliquer immédiatement les thèmes par défaut des fichiers de configuration
    setKYCThemeState(defaultKYCTheme);
    setKYBThemeState(defaultKYBTheme);
  }, []);

  // Mettre à jour le thème KYC
  const setKYCTheme = (theme: Partial<KYCThemeConfig>) => {
    setKYCThemeState(currentTheme => {
      const newTheme = {
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
        },
        effects: {
          ...currentTheme.effects,
          ...(theme.effects || {}),
          backgroundGradient: {
            ...(currentTheme.effects?.backgroundGradient || {}),
            ...(theme.effects?.backgroundGradient || {})
          },
          glow: {
            ...(currentTheme.effects?.glow || {}),
            ...(theme.effects?.glow || {})
          },
          animations: {
            ...(currentTheme.effects?.animations || {}),
            ...(theme.effects?.animations || {}),
            pulse: {
              ...(currentTheme.effects?.animations?.pulse || {}),
              ...(theme.effects?.animations?.pulse || {})
            },
            glow: {
              ...(currentTheme.effects?.animations?.glow || {}),
              ...(theme.effects?.animations?.glow || {})
            }
          }
        }
      };
      return newTheme;
    });
  };

  // Mettre à jour le thème KYB
  const setKYBTheme = (theme: Partial<KYBThemeConfig>) => {
    setKYBThemeState(currentTheme => {
      const newTheme = {
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
        },
        effects: {
          ...currentTheme.effects,
          ...(theme.effects || {}),
          backgroundGradient: {
            ...(currentTheme.effects?.backgroundGradient || {}),
            ...(theme.effects?.backgroundGradient || {})
          },
          glow: {
            ...(currentTheme.effects?.glow || {}),
            ...(theme.effects?.glow || {})
          },
          animations: {
            ...(currentTheme.effects?.animations || {}),
            ...(theme.effects?.animations || {}),
            pulse: {
              ...(currentTheme.effects?.animations?.pulse || {}),
              ...(theme.effects?.animations?.pulse || {})
            },
            glow: {
              ...(currentTheme.effects?.animations?.glow || {}),
              ...(theme.effects?.animations?.glow || {})
            }
          }
        }
      };
      return newTheme;
    });
  };

  // Réinitialiser au thème KYC par défaut
  const resetKYCTheme = () => {
    setKYCThemeState(defaultKYCTheme);
  };

  // Réinitialiser au thème KYB par défaut
  const resetKYBTheme = () => {
    setKYBThemeState(defaultKYBTheme);
  };
  
  // Appliquer un thème KYC prédéfini
  const applyKYCTheme = (themeName: string) => {
    switch (themeName) {
      case 'default':
        setKYCThemeState(defaultKYCTheme);
        break;
      case 'blue':
        setKYCThemeState(blueKYCTheme);
        break;
      case 'light':
        setKYCThemeState(lightKYCTheme);
        break;
      default:
        console.warn(`Thème KYC inconnu: ${themeName}`);
    }
  };
  
  // Appliquer un thème KYB prédéfini
  const applyKYBTheme = (themeName: string) => {
    switch (themeName) {
      case 'default':
        setKYBThemeState(defaultKYBTheme);
        break;
      case 'enterprise':
        setKYBThemeState(enterpriseKYBTheme);
        break;
      case 'light':
        setKYBThemeState(lightKYBTheme);
        break;
      default:
        console.warn(`Thème KYB inconnu: ${themeName}`);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        kycTheme, 
        kybTheme, 
        setKYCTheme, 
        setKYBTheme, 
        resetKYCTheme, 
        resetKYBTheme,
        applyKYCTheme,
        applyKYBTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le contexte de thème
export const useThemeContext = () => useContext(ThemeContext);