import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KYBStepConfig, defaultKYBConfig, getActiveKYBSteps } from '../config/kybSteps';
import { useIsMobile } from './useIsMobile';

interface KYBStep {
  id: string;
  index: number;
}

export function useKYBFlow(config: KYBStepConfig = defaultKYBConfig) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeSteps, setActiveSteps] = useState<KYBStep[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Initialiser les étapes actives en fonction de la configuration
  useEffect(() => {
    const steps = getActiveKYBSteps(config);
    
    // Filtrer l'étape mobile si l'utilisateur est sur un appareil mobile
    const filteredSteps = isMobile 
      ? steps.filter(step => step !== 'mobileOption') 
      : steps;
    
    const mappedSteps = filteredSteps.map((step, index) => ({
      id: step,
      index: index + 1
    }));
    
    setActiveSteps(mappedSteps);
    
    // Si l'utilisateur était sur l'étape mobile et qu'on la supprime,
    // il faut s'assurer que l'index courant est valide
    if (isMobile && currentStepIndex >= mappedSteps.length) {
      setCurrentStepIndex(Math.max(0, mappedSteps.length - 1));
    }
  }, [config, isMobile]);
  
  // Trouver l'étape actuelle
  const currentStep = activeSteps.length > 0 ? activeSteps[currentStepIndex] : null;
  
  // Obtenir le nombre total d'étapes
  const totalSteps = activeSteps.length;
  
  // Passer à l'étape suivante
  const nextStep = () => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      return true;
    } else {
      // Dernière étape, rediriger vers la page de vérification
      navigate('/verifying');
      return false;
    }
  };
  
  // Revenir à l'étape précédente
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      return true;
    }
    return false;
  };
  
  // Aller à une étape spécifique
  const goToStep = (stepId: string) => {
    const stepIndex = activeSteps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      return true;
    }
    return false;
  };
  
  // Vérifier si une étape est active
  const isStepActive = (stepId: string) => {
    return activeSteps.some(step => step.id === stepId);
  };
  
  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    isStepActive,
    activeSteps,
    isMobile
  };
}