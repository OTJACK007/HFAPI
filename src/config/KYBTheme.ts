// Configuration du thème pour le processus KYB (Know Your Business)
import { BackgroundGradientConfig, GlowEffectConfig, AnimationConfig, defaultBackgroundGradient, defaultGlowEffect, defaultAnimations } from './ThemeEffects';

export interface KYBThemeConfig {
  // Mode thème : clair ou sombre
  theme: 'dark' | 'light';
  
  // Couleurs principales
  colors: {
    // Couleur primaire (utilisée pour les accentuations, progressions, etc.)
    primary: string;
    
    // Couleur des boutons principaux
    buttonColor: string;
    
    // Couleur du texte sur les boutons 
    buttonTextColor: string;
    
    // Couleur d'arrière-plan (uniquement utilisée en mode light)
    background?: string;
    
    // Couleur de texte (ajustée automatiquement selon le thème)
    textColor?: string;
    
    // Couleur secondaire (utilisée pour des éléments complémentaires)
    secondary?: string;
    
    // Couleur d'erreur
    error?: string;
    
    // Couleur pour les éléments désactivés
    disabled?: string;
  };
  
  // Configuration des rayons des bordures
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  
  // Configuration des ombres
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  
  // Configuration des effets visuels
  effects?: {
    // Configuration du gradient d'arrière-plan
    backgroundGradient?: BackgroundGradientConfig;
    
    // Configuration de l'effet de lueur
    glow?: GlowEffectConfig;
    
    // Configuration des animations
    animations?: AnimationConfig;
  };
}

// Thème par défaut - correspond au thème actuel de l'application
// MODIFIEZ CES VALEURS POUR CHANGER LE THÈME KYB
export const defaultKYBTheme: KYBThemeConfig = {
  theme: 'dark',
  colors: {
    primary: '#ff3366', // MODIFIEZ CETTE VALEUR POUR CHANGER LA COULEUR PRIMAIRE
    buttonColor: '#ff3366', // MODIFIEZ CETTE VALEUR POUR CHANGER LA COULEUR DES BOUTONS
    buttonTextColor: '#FFFFFF',
    secondary: '#2eff94', // MODIFIEZ CETTE VALEUR POUR CHANGER LA COULEUR SECONDAIRE
    background: '#1A1A1A',
    textColor: '#FFFFFF',
    error: '#FF453A',
    disabled: '#6E6E6E'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem'
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  effects: {
    backgroundGradient: {
      ...defaultBackgroundGradient,
      fromColor: '#ff3366',  // Utilise la couleur primaire
    },
    glow: {
      ...defaultGlowEffect,
      color: '#ff3366',      // Utilise la couleur primaire
    },
    animations: {
      ...defaultAnimations,
      glow: {
        ...defaultAnimations.glow,
        fromColor: '#ff3366',  // Utilise la couleur primaire
        toColor: '#2eff94'     // Utilise la couleur secondaire
      }
    }
  }
};

// Exemples de thèmes prédéfinis
export const lightKYBTheme: KYBThemeConfig = {
  theme: 'light',
  colors: {
    primary: '#ff3366',
    buttonColor: '#ff3366',
    buttonTextColor: '#FFFFFF',
    secondary: '#2eff94',
    background: '#FFFFFF',
    textColor: '#333333',
    error: '#FF453A',
    disabled: '#CCCCCC'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem'
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  effects: {
    backgroundGradient: {
      ...defaultBackgroundGradient,
      fromColor: '#ff3366',  // Utilise la couleur primaire
      toColor: '#FFFFFF',    // Utilise la couleur d'arrière-plan mode clair
    },
    glow: {
      ...defaultGlowEffect,
      color: '#ff3366',      // Utilise la couleur primaire
      opacity: 0.6,          // Réduire l'opacité pour le mode clair
    },
    animations: {
      ...defaultAnimations,
      glow: {
        ...defaultAnimations.glow,
        fromColor: '#ff3366',  // Utilise la couleur primaire
        toColor: '#2eff94'     // Utilise la couleur secondaire
      }
    }
  }
};

export const enterpriseKYBTheme: KYBThemeConfig = {
  theme: 'dark',
  colors: {
    primary: '#4F46E5', // Indigo
    buttonColor: '#4F46E5',
    buttonTextColor: '#FFFFFF',
    secondary: '#10B981', // Emerald
    background: '#1E1E2D',
    textColor: '#FFFFFF',
    error: '#EF4444',
    disabled: '#6B7280'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem'
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  effects: {
    backgroundGradient: {
      ...defaultBackgroundGradient,
      fromColor: '#4F46E5',  // Utilise la couleur primaire
      toColor: '#1E1E2D',    // Utilise la couleur d'arrière-plan
    },
    glow: {
      ...defaultGlowEffect,
      color: '#4F46E5',      // Utilise la couleur primaire
    },
    animations: {
      ...defaultAnimations,
      glow: {
        ...defaultAnimations.glow,
        fromColor: '#4F46E5',  // Utilise la couleur primaire
        toColor: '#10B981'     // Utilise la couleur secondaire
      }
    }
  }
};

// Fonction utilitaire pour fusionner un thème personnalisé avec le thème par défaut
export function mergeWithDefaultKYBTheme(customTheme: Partial<KYBThemeConfig>): KYBThemeConfig {
  return {
    theme: customTheme.theme || defaultKYBTheme.theme,
    colors: {
      ...defaultKYBTheme.colors,
      ...(customTheme.colors || {})
    },
    borderRadius: {
      ...defaultKYBTheme.borderRadius,
      ...(customTheme.borderRadius || {})
    },
    shadows: {
      ...defaultKYBTheme.shadows,
      ...(customTheme.shadows || {})
    },
    effects: {
      backgroundGradient: {
        ...(defaultKYBTheme.effects?.backgroundGradient || defaultBackgroundGradient),
        ...(customTheme.effects?.backgroundGradient || {})
      },
      glow: {
        ...(defaultKYBTheme.effects?.glow || defaultGlowEffect),
        ...(customTheme.effects?.glow || {})
      },
      animations: {
        ...(defaultKYBTheme.effects?.animations || defaultAnimations),
        pulse: {
          ...(defaultKYBTheme.effects?.animations?.pulse || defaultAnimations.pulse),
          ...(customTheme.effects?.animations?.pulse || {})
        },
        glow: {
          ...(defaultKYBTheme.effects?.animations?.glow || defaultAnimations.glow),
          ...(customTheme.effects?.animations?.glow || {})
        }
      }
    }
  };
}