import { useState, useEffect } from 'react';

/**
 * Hook pour détecter si l'utilisateur est sur un appareil mobile
 * @returns {boolean} true si l'utilisateur est sur un appareil mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Fonction pour vérifier si l'appareil est mobile
    const checkIsMobile = (): boolean => {
      // Utiliser userAgent pour détecter les appareils mobiles
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Expressions régulières pour détecter les appareils mobiles
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      // Vérifier également la largeur de l'écran pour les tablettes
      const isMobileScreenSize = window.innerWidth <= 768;
      
      return mobileRegex.test(userAgent) || isMobileScreenSize;
    };

    // Définir l'état initial
    setIsMobile(checkIsMobile());

    // Ajouter un écouteur d'événements pour les changements de taille d'écran
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener('resize', handleResize);

    // Nettoyer l'écouteur d'événements
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}