import React, { useEffect, ReactNode } from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import { KYCThemeConfig } from '../config/KYCTheme';
import { KYBThemeConfig } from '../config/KYBTheme';

interface ThemeWrapperProps {
  children: ReactNode;
  themeType: 'kyc' | 'kyb';
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ 
  children, 
  themeType 
}) => {
  const { kycTheme, kybTheme } = useThemeContext();
  
  // Déterminer quel thème utiliser en fonction du type
  const theme = themeType === 'kyc' ? kycTheme : kybTheme;
  
  // Appliquer les CSS variables au niveau du conteneur
  useEffect(() => {
    const isLightTheme = theme.theme === 'light';
    
    // Appliquer la classe de thème au document
    if (isLightTheme) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    
    // Appliquer les variables CSS personnalisées
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--primary-foreground', theme.colors.buttonTextColor);
    
    // Appliquer la couleur du bouton
    document.documentElement.style.setProperty('--button-color', theme.colors.buttonColor);
    document.documentElement.style.setProperty('--button-text-color', theme.colors.buttonTextColor);
    
    if (theme.colors.secondary) {
      document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      // Réinitialiser les variables CSS si nécessaire
      // Ou les remettre à leurs valeurs par défaut
    };
  }, [theme]);
  
  // Style de base pour le conteneur en fonction du thème
  const containerStyle = {
    backgroundColor: theme.theme === 'light' 
      ? theme.colors.background || '#FFFFFF' 
      : theme.colors.background || '#1A1A1A',
    color: theme.theme === 'light'
      ? theme.colors.textColor || '#333333'
      : theme.colors.textColor || '#FFFFFF',
    minHeight: '100vh', // Assurer que le conteneur couvre toute la hauteur
  };
  
  return (
    <div style={containerStyle}>
      {children}
    </div>
  );
};

// Composant de wrapper spécifique pour KYC
export const KYCThemeWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ThemeWrapper themeType="kyc">{children}</ThemeWrapper>;
};

// Composant de wrapper spécifique pour KYB
export const KYBThemeWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ThemeWrapper themeType="kyb">{children}</ThemeWrapper>;
};