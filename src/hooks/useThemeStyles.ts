import { useMemo } from 'react';
import { KYCThemeConfig, defaultKYCTheme } from '../config/KYCTheme';
import { KYBThemeConfig, defaultKYBTheme } from '../config/KYBTheme';
import { generateBackgroundGradient, generateGlowEffect } from '../config/ThemeEffects';

// Hook pour générer les styles CSS à partir d'une configuration de thème KYC
export function useKYCThemeStyles(themeConfig: KYCThemeConfig = defaultKYCTheme) {
  return useMemo(() => {
    const isLightTheme = themeConfig.theme === 'light';
    
    // Générer les styles spécifiques pour les gradients et effets de lueur
    const backgroundGradient = themeConfig.effects?.backgroundGradient 
      ? generateBackgroundGradient(themeConfig.effects.backgroundGradient)
      : `radial-gradient(circle at center, ${themeConfig.colors.primary}20, ${
          isLightTheme 
            ? themeConfig.colors.background || '#FFFFFF' 
            : themeConfig.colors.background || '#1A1A1A'
        })`;
    
    const glowEffect = themeConfig.effects?.glow
      ? generateGlowEffect(themeConfig.effects.glow)
      : `0 0 40px ${themeConfig.colors.primary}80`;
    
    // Animation de lueur (pour les éléments avec animation)
    const glowAnimation = themeConfig.effects?.animations?.glow
      ? `${themeConfig.effects.animations.glow.duration || 4}s ease-in-out infinite alternate`
      : '4s ease-in-out infinite alternate';
    
    // Animation de pulsation de texte
    const pulseAnimation = themeConfig.effects?.animations?.pulse
      ? `${themeConfig.effects.animations.pulse.duration || 2}s ease-in-out infinite`
      : '2s ease-in-out infinite';
    
    // Retourner un objet avec tous les styles générés
    return {
      colors: {
        primary: themeConfig.colors.primary,
        secondary: themeConfig.colors.secondary || '#2eff94',
        background: themeConfig.colors.background || (isLightTheme ? '#FFFFFF' : '#1A1A1A'),
        textColor: themeConfig.colors.textColor || (isLightTheme ? '#333333' : '#FFFFFF'),
        buttonColor: themeConfig.colors.buttonColor || themeConfig.colors.primary,
        buttonTextColor: themeConfig.colors.buttonTextColor || '#FFFFFF',
        error: themeConfig.colors.error || '#FF453A',
        disabled: themeConfig.colors.disabled || (isLightTheme ? '#CCCCCC' : '#6E6E6E'),
      },
      effects: {
        backgroundGradient,
        glow: glowEffect,
      },
      animations: {
        glow: glowAnimation,
        pulse: pulseAnimation,
      },
      borderRadius: {
        sm: themeConfig.borderRadius?.sm || '0.25rem',
        md: themeConfig.borderRadius?.md || '0.5rem',
        lg: themeConfig.borderRadius?.lg || '1rem',
      },
      shadows: {
        sm: themeConfig.shadows?.sm || '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: themeConfig.shadows?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: themeConfig.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      cssVariables: {
        '--primary': themeConfig.colors.primary,
        '--primary-foreground': themeConfig.colors.buttonTextColor || '#FFFFFF',
        '--secondary': themeConfig.colors.secondary || '#2eff94',
        '--background': themeConfig.colors.background || (isLightTheme ? '#FFFFFF' : '#1A1A1A'),
        '--text-color': themeConfig.colors.textColor || (isLightTheme ? '#333333' : '#FFFFFF'),
        '--button-color': themeConfig.colors.buttonColor || themeConfig.colors.primary,
        '--button-text-color': themeConfig.colors.buttonTextColor || '#FFFFFF',
        '--glow-effect': glowEffect,
        '--glow-animation': glowAnimation,
        '--pulse-animation': pulseAnimation,
      }
    };
  }, [themeConfig]);
}

// Hook pour générer les styles CSS à partir d'une configuration de thème KYB
export function useKYBThemeStyles(themeConfig: KYBThemeConfig = defaultKYBTheme) {
  return useMemo(() => {
    const isLightTheme = themeConfig.theme === 'light';
    
    // Générer les styles spécifiques pour les gradients et effets de lueur
    const backgroundGradient = themeConfig.effects?.backgroundGradient 
      ? generateBackgroundGradient(themeConfig.effects.backgroundGradient)
      : `radial-gradient(circle at center, ${themeConfig.colors.primary}20, ${
          isLightTheme 
            ? themeConfig.colors.background || '#FFFFFF' 
            : themeConfig.colors.background || '#1A1A1A'
        })`;
    
    const glowEffect = themeConfig.effects?.glow
      ? generateGlowEffect(themeConfig.effects.glow)
      : `0 0 40px ${themeConfig.colors.primary}80`;
    
    // Animation de lueur (pour les éléments avec animation)
    const glowAnimation = themeConfig.effects?.animations?.glow
      ? `${themeConfig.effects.animations.glow.duration || 4}s ease-in-out infinite alternate`
      : '4s ease-in-out infinite alternate';
    
    // Animation de pulsation de texte
    const pulseAnimation = themeConfig.effects?.animations?.pulse
      ? `${themeConfig.effects.animations.pulse.duration || 2}s ease-in-out infinite`
      : '2s ease-in-out infinite';
    
    // Retourner un objet avec tous les styles générés
    return {
      colors: {
        primary: themeConfig.colors.primary,
        secondary: themeConfig.colors.secondary || '#2eff94',
        background: themeConfig.colors.background || (isLightTheme ? '#FFFFFF' : '#1A1A1A'),
        textColor: themeConfig.colors.textColor || (isLightTheme ? '#333333' : '#FFFFFF'),
        buttonColor: themeConfig.colors.buttonColor || themeConfig.colors.primary,
        buttonTextColor: themeConfig.colors.buttonTextColor || '#FFFFFF',
        error: themeConfig.colors.error || '#FF453A',
        disabled: themeConfig.colors.disabled || (isLightTheme ? '#CCCCCC' : '#6E6E6E'),
      },
      effects: {
        backgroundGradient,
        glow: glowEffect,
      },
      animations: {
        glow: glowAnimation,
        pulse: pulseAnimation,
      },
      borderRadius: {
        sm: themeConfig.borderRadius?.sm || '0.25rem',
        md: themeConfig.borderRadius?.md || '0.5rem',
        lg: themeConfig.borderRadius?.lg || '1rem',
      },
      shadows: {
        sm: themeConfig.shadows?.sm || '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: themeConfig.shadows?.md || '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: themeConfig.shadows?.lg || '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      cssVariables: {
        '--primary': themeConfig.colors.primary,
        '--primary-foreground': themeConfig.colors.buttonTextColor || '#FFFFFF',
        '--secondary': themeConfig.colors.secondary || '#2eff94',
        '--background': themeConfig.colors.background || (isLightTheme ? '#FFFFFF' : '#1A1A1A'),
        '--text-color': themeConfig.colors.textColor || (isLightTheme ? '#333333' : '#FFFFFF'),
        '--button-color': themeConfig.colors.buttonColor || themeConfig.colors.primary,
        '--button-text-color': themeConfig.colors.buttonTextColor || '#FFFFFF',
        '--glow-effect': glowEffect,
        '--glow-animation': glowAnimation,
        '--pulse-animation': pulseAnimation,
      }
    };
  }, [themeConfig]);
}

// Hook personnalisé qui retourne les styles adaptés au type de processus (KYC ou KYB)
export function useThemeStyles(themeType: 'kyc' | 'kyb', themeConfig?: KYCThemeConfig | KYBThemeConfig) {
  if (themeType === 'kyc') {
    return useKYCThemeStyles(themeConfig as KYCThemeConfig);
  } else {
    return useKYBThemeStyles(themeConfig as KYBThemeConfig);
  }
}