import React, { useEffect, ReactNode } from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import { KYCThemeConfig } from '../config/KYCTheme';
import { KYBThemeConfig } from '../config/KYBTheme';
import { useThemeStyles } from '../hooks/useThemeStyles';

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
  
  // Utiliser le hook pour générer tous les styles nécessaires
  const themeStyles = useThemeStyles(themeType, theme);
  
  // Appliquer les CSS variables au niveau du conteneur
  useEffect(() => {
    const isLightTheme = theme.theme === 'light';
    const root = document.documentElement;
    
    // Appliquer la classe de thème au document
    if (isLightTheme) {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    
    // Appliquer les variables CSS personnalisées
    for (const [key, value] of Object.entries(themeStyles.cssVariables)) {
      root.style.setProperty(key, value);
    }
    
    // Ajouter des styles personnalisés pour écraser les classes Tailwind
    const styleId = 'dynamic-theme-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Créer des règles CSS qui vont surcharger les classes Tailwind
    styleElement.textContent = `
      /* Surcharge des couleurs Tailwind */
      .bg-primary {
        background-color: ${themeStyles.colors.primary} !important;
      }
      .text-primary {
        color: ${themeStyles.colors.primary} !important;
      }
      .border-primary {
        border-color: ${themeStyles.colors.primary} !important;
      }
      
      /* Surcharge pour les boutons NextUI */
      [data-slot="base"][data-color="primary"] {
        background-color: ${themeStyles.colors.buttonColor} !important;
        color: ${themeStyles.colors.buttonTextColor} !important;
      }
      
      /* Surcharge pour les éléments d'animation */
      .animate-glow {
        animation: ${themeStyles.animations.glow} !important;
        box-shadow: ${themeStyles.effects.glow} !important;
      }
      
      /* Arrière-plan radial */
      .bg-gradient-radial {
        background-image: ${themeStyles.effects.backgroundGradient} !important;
      }
    `;
    
    // Nettoyage lors du démontage du composant
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [theme, themeStyles]);
  
  return <>{children}</>;
};

// Composant de wrapper spécifique pour KYC
export const KYCThemeWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ThemeWrapper themeType="kyc">{children}</ThemeWrapper>;
};

// Composant de wrapper spécifique pour KYB
export const KYBThemeWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <ThemeWrapper themeType="kyb">{children}</ThemeWrapper>;
};