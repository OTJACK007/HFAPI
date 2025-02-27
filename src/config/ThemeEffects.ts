// Configuration des effets visuels communs utilisés dans l'application

export interface BackgroundGradientConfig {
  // Type de gradient (radial est utilisé par défaut dans l'application)
  type: 'radial' | 'linear' | 'conic';
  
  // Couleur primaire pour le gradient (généralement dérivée de la couleur principale)
  fromColor: string;
  
  // Opacité de la couleur primaire
  fromOpacity: number;
  
  // Couleur de base (généralement la couleur d'arrière-plan)
  toColor: string;
  
  // Direction du gradient (pour les gradients linéaires uniquement)
  direction?: string;
  
  // Position du point de départ (pour les gradients radiaux)
  position?: string;
}

export interface GlowEffectConfig {
  // Couleur principale de l'effet de lueur
  color: string;
  
  // Opacité de la lueur
  opacity: number;
  
  // Taille du flou (px)
  blurSize: number;
  
  // Intensité de la lueur (pour les animations)
  intensity: number;
  
  // Durée de l'animation en secondes
  animationDuration: number;
}

export interface AnimationConfig {
  // Configuration pour l'animation de pulsation
  pulse: {
    // Durée de l'animation en secondes
    duration: number;
    
    // Opacité minimale
    minOpacity: number;
    
    // Opacité maximale
    maxOpacity: number;
  };
  
  // Configuration pour l'animation de lueur
  glow: {
    // Durée de l'animation en secondes
    duration: number;
    
    // Couleur de départ pour l'animation
    fromColor: string;
    
    // Couleur de fin pour l'animation
    toColor: string;
    
    // Taille minimum de la lueur
    minSize: string;
    
    // Taille maximum de la lueur
    maxSize: string;
  };
}

// Configurations par défaut basées sur le design actuel
export const defaultBackgroundGradient: BackgroundGradientConfig = {
  type: 'radial',
  fromColor: '#ff3366',
  fromOpacity: 0.2,
  toColor: '#1A1A1A',
  position: 'center'
};

export const defaultGlowEffect: GlowEffectConfig = {
  color: '#ff3366',
  opacity: 0.8,
  blurSize: 40,
  intensity: 1.5,
  animationDuration: 4
};

export const defaultAnimations: AnimationConfig = {
  pulse: {
    duration: 2,
    minOpacity: 0.7,
    maxOpacity: 1
  },
  glow: {
    duration: 4,
    fromColor: '#ff3366',
    toColor: '#2eff94',
    minSize: '0 0 40px',
    maxSize: '0 0 80px'
  }
};

// Fonction pour générer le CSS du gradient d'arrière-plan
export function generateBackgroundGradient(config: BackgroundGradientConfig): string {
  switch (config.type) {
    case 'radial':
      return `radial-gradient(${config.position || 'center'}, ${config.fromColor}${Math.round(config.fromOpacity * 100)}, ${config.toColor})`;
    case 'linear':
      return `linear-gradient(${config.direction || 'to bottom'}, ${config.fromColor}${Math.round(config.fromOpacity * 100)}, ${config.toColor})`;
    case 'conic':
      return `conic-gradient(from 0deg at ${config.position || 'center'}, ${config.fromColor}${Math.round(config.fromOpacity * 100)}, ${config.toColor})`;
    default:
      return `radial-gradient(${config.position || 'center'}, ${config.fromColor}${Math.round(config.fromOpacity * 100)}, ${config.toColor})`;
  }
}

// Fonction pour générer le CSS de l'effet de lueur
export function generateGlowEffect(config: GlowEffectConfig): string {
  return `0 0 ${config.blurSize}px ${config.color}${Math.round(config.opacity * 100)}`;
}

// Fonction pour générer les keyframes CSS pour les animations
export function generateAnimationKeyframes(config: AnimationConfig): Record<string, string> {
  return {
    pulse: `
      @keyframes pulse-text {
        0%, 100% { opacity: ${config.pulse.maxOpacity}; }
        50% { opacity: ${config.pulse.minOpacity}; }
      }
    `,
    glow: `
      @keyframes glow {
        0% { box-shadow: ${config.glow.minSize} ${config.glow.fromColor}; }
        100% { box-shadow: ${config.glow.maxSize} ${config.glow.toColor}; }
      }
    `
  };
}