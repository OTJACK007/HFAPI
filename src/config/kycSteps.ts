// Configuration des étapes de KYC (Know Your Customer)
export interface KYCStepConfig {
  // Informations de base
  basicInfo: boolean;
  
  // Vérifications
  emailVerification: boolean;
  phoneVerification: boolean;
  
  // Adresse
  addressInfo: boolean;
  
  // Document d'identité
  documentSelection: boolean;
  documentIdNumber: boolean;
  documentRectoCapture: boolean;
  documentVersoCapture: boolean;
  
  // Justificatif de domicile
  addressDocSelection: boolean;
  addressDocCapture: boolean;
  
  // Vérification biométrique
  mobileOption: boolean; // Cette étape est toujours activée dans la config, mais sera sautée automatiquement sur mobile
  selfieCapture: boolean;
  livenessDetection: boolean;
}

// Configuration par défaut (toutes les étapes activées)
export const defaultKYCConfig: KYCStepConfig = {
  basicInfo: true,
  emailVerification: true,
  phoneVerification: true,
  addressInfo: true,
  documentSelection: true,
  documentIdNumber: true,
  documentRectoCapture: true,
  documentVersoCapture: true,
  addressDocSelection: true,
  addressDocCapture: true,
  mobileOption: true, // Obligatoire dans la configuration, mais sera ignoré sur mobile
  selfieCapture: true,
  livenessDetection: true
};

// Fonctions utilitaires
export function getActiveKYCSteps(config: KYCStepConfig = defaultKYCConfig): string[] {
  const steps: string[] = [];
  
  if (config.basicInfo) steps.push('basicInfo');
  if (config.emailVerification) steps.push('emailVerification');
  if (config.phoneVerification) steps.push('phoneVerification');
  if (config.addressInfo) steps.push('addressInfo');
  if (config.documentSelection) steps.push('documentSelection');
  if (config.documentIdNumber) steps.push('documentIdNumber');
  if (config.documentRectoCapture) steps.push('documentRectoCapture');
  if (config.documentVersoCapture) steps.push('documentVersoCapture');
  if (config.addressDocSelection) steps.push('addressDocSelection');
  if (config.addressDocCapture) steps.push('addressDocCapture');
  if (config.mobileOption) steps.push('mobileOption'); // Toujours inclus dans les étapes actives selon la config
  if (config.selfieCapture) steps.push('selfieCapture');
  if (config.livenessDetection) steps.push('livenessDetection');
  
  return steps;
}

// Exemples de configurations prédéfinies
export const minimalKYCConfig: KYCStepConfig = {
  basicInfo: true,
  emailVerification: false,
  phoneVerification: false,
  addressInfo: true,
  documentSelection: true,
  documentIdNumber: true,
  documentRectoCapture: true,
  documentVersoCapture: false,
  addressDocSelection: false,
  addressDocCapture: false,
  mobileOption: true, // Toujours obligatoire dans la config
  selfieCapture: false,
  livenessDetection: false
};

export const standardKYCConfig: KYCStepConfig = {
  basicInfo: true,
  emailVerification: true,
  phoneVerification: false,
  addressInfo: true,
  documentSelection: true,
  documentIdNumber: true,
  documentRectoCapture: true,
  documentVersoCapture: true,
  addressDocSelection: true,
  addressDocCapture: true,
  mobileOption: true, // Toujours obligatoire dans la config
  selfieCapture: true,
  livenessDetection: false
};

export const enhancedKYCConfig: KYCStepConfig = {
  ...defaultKYCConfig
};