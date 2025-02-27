import { useMemo } from 'react';
import { KYCThemeConfig, defaultKYCTheme } from '../config/KYCTheme';
import { KYBThemeConfig, defaultKYBTheme } from '../config/KYBTheme';

// Hook pour générer les styles CSS à partir d'une configuration de thème KYC
export function useKYCThemeStyles(themeConfig: KYCThemeConfig = defaultKYCTheme) {
  return useMemo(() => {
    const isLightTheme = themeConfig.theme === 'light';
    
    return {
      // Styles de base pour les conteneurs
      container: {
        backgroundColor: isLightTheme 
          ? themeConfig.colors.background || '#FFFFFF' 
          : themeConfig.colors.background || '#1A1A1A',
        color: isLightTheme
          ? themeConfig.colors.textColor || '#333333'
          : themeConfig.colors.textColor || '#FFFFFF'
      },
      
      // Styles pour les boutons principaux
      primaryButton: {
        backgroundColor: themeConfig.colors.buttonColor,
        color: themeConfig.colors.buttonTextColor,
        borderRadius: themeConfig.borderRadius?.md || '0.5rem',
        boxShadow: themeConfig.shadows?.sm
      },
      
      // Styles pour les éléments avec couleur primaire
      primaryElement: {
        color: themeConfig.colors.primary,
        borderColor: themeConfig.colors.primary
      },
      
      // Styles pour les éléments avec couleur secondaire
      secondaryElement: {
        color: themeConfig.colors.secondary,
        borderColor: themeConfig.colors.secondary
      },
      
      // Styles pour les cartes et conteneurs
      card: {
        backgroundColor: isLightTheme 
          ? '#F9FAFB' 
          : 'rgba(26, 26, 26, 0.4)',
        borderColor: isLightTheme 
          ? 'rgba(0, 0, 0, 0.1)' 
          : 'rgba(255, 255, 255, 0.1)',
        borderRadius: themeConfig.borderRadius?.lg || '1rem',
        boxShadow: themeConfig.shadows?.md
      },
      
      // Styles pour le suivi des étapes et progressions
      progress: {
        backgroundColor: themeConfig.colors.primary,
        borderRadius: themeConfig.borderRadius?.sm || '0.25rem'
      },
      
      // Styles pour les formulaires et champs de saisie
      input: {
        backgroundColor: 'transparent',
        borderColor: isLightTheme 
          ? 'rgba(0, 0, 0, 0.2)' 
          : 'rgba(255, 255, 255, 0.2)',
        color: isLightTheme
          ? themeConfig.colors.textColor || '#333333'
          : themeConfig.colors.textColor || '#FFFFFF',
        borderRadius: themeConfig.borderRadius?.md || '0.5rem'
      },
      
      // Styles pour les messages d'erreur
      error: {
        color: themeConfig.colors.error || '#FF453A'
      },
      
      // Styles pour les éléments désactivés
      disabled: {
        color: themeConfig.colors.disabled || '#6E6E6E',
        backgroundColor: isLightTheme 
          ? 'rgba(0, 0, 0, 0.1)' 
          : 'rgba(255, 255, 255, 0.1)'
      },
      
      // Styles pour les gradients
      gradient: {
        background: `radial-gradient(circle at center, ${themeConfig.colors.primary}20, ${
          isLightTheme 
            ? themeConfig.colors.background || '#FFFFFF' 
            : themeConfig.colors.background || '#1A1A1A'
        })`
      },
      
      // CSS variable overrides (for NextUI and other components)
      cssVariables: {
        '--primary': themeConfig.colors.primary,
        '--primary-foreground': themeConfig.colors.buttonTextColor,
        '--secondary': themeConfig.colors.secondary || '#2eff94',
        '--background': isLightTheme 
          ? themeConfig.colors.background || '#FFFFFF' 
          : themeConfig.colors.background || '#1A1A1A',
        '--foreground': isLightTheme
          ? themeConfig.colors.textColor || '#333333'
          : themeConfig.colors.textColor || '#FFFFFF',
      }
    };
  }, [themeConfig]);
}

// Hook pour générer les styles CSS à partir d'une configuration de thème KYB
export function useKYBThemeStyles(themeConfig: KYBThemeConfig = defaultKYBTheme) {
  return useMemo(() => {
    const isLightTheme = themeConfig.theme === 'light';
    
    return {
      // Styles de base pour les conteneurs
      container: {
        backgroundColor: isLightTheme 
          ? themeConfig.colors.background || '#FFFFFF' 
          : themeConfig.colors.background || '#1A1A1A',
        color: isLightTheme
          ? themeConfig.colors.textColor || '#333333'
          : themeConfig.colors.textColor || '#FFFFFF'
      },
      
      // Styles pour les boutons principaux
      primaryButton: {
        backgroundColor: themeConfig.colors.buttonColor,
        color: themeConfig.colors.buttonTextColor,
        borderRadius: themeConfig.borderRadius?.md || '0.5rem',
        boxShadow: themeConfig.shadows?.sm
      },
      
      // Styles pour les éléments avec couleur primaire
      primaryElement: {
        color: themeConfig.colors.primary,
        borderColor: themeConfig.colors.primary
      },
      
      // Styles pour les éléments avec couleur secondaire
      secondaryElement: {
        color: themeConfig.colors.secondary,
        borderColor: themeConfig.colors.secondary
      },
      
      // Styles pour les cartes et conteneurs
      card: {
        backgroundColor: isLightTheme 
          ? '#F9FAFB' 
          : 'rgba(26, 26, 26, 0.4)',
        borderColor: isLightTheme 
          ? 'rgba(0, 0, 0, 0.1)' 
          : 'rgba(255, 255, 255, 0.1)',
        borderRadius: themeConfig.borderRadius?.lg || '1rem',
        boxShadow: themeConfig.shadows?.md
      },
      
      // Styles pour le suivi des étapes et progressions
      progress: {
        backgroundColor: themeConfig.colors.primary,
        borderRadius: themeConfig.borderRadius?.sm || '0.25rem'
      },
      
      // Styles pour les formulaires et champs de saisie
      input: {
        backgroundColor: 'transparent',
        borderColor: isLightTheme 
          ? 'rgba(0, 0, 0, 0.2)' 
          : 'rgba(255, 255, 255, 0.2)',
        color: isLightTheme
          ? themeConfig.colors.textColor || '#333333'
          : themeConfig.colors.textColor || '#FFFFFF',
        borderRadius: themeConfig.borderRadius?.md || '0.5rem'
      },
      
      // Styles pour les messages d'erreur
      error: {
        color: themeConfig.colors.error || '#FF453A'
      },
      
      // Styles pour les éléments désactivés
      disabled: {
        color: themeConfig.colors.disabled || '#6E6E6E',
        backgroundColor: isLightTheme 
          ? 'rgba(0, 0, 0, 0.1)' 
          : 'rgba(255, 255, 255, 0.1)'
      },
      
      // Styles pour les gradients
      gradient: {
        background: `radial-gradient(circle at center, ${themeConfig.colors.primary}20, ${
          isLightTheme 
            ? themeConfig.colors.background || '#FFFFFF' 
            : themeConfig.colors.background || '#1A1A1A'
        })`
      },
      
      // CSS variable overrides (for NextUI and other components)
      cssVariables: {
        '--primary': themeConfig.colors.primary,
        '--primary-foreground': themeConfig.colors.buttonTextColor,
        '--secondary': themeConfig.colors.secondary || '#2eff94',
        '--background': isLightTheme 
          ? themeConfig.colors.background || '#FFFFFF' 
          : themeConfig.colors.background || '#1A1A1A',
        '--foreground': isLightTheme
          ? themeConfig.colors.textColor || '#333333'
          : themeConfig.colors.textColor || '#FFFFFF',
      }
    };
  }, [themeConfig]);
}