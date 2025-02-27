// Configuration des étapes de KYB (Know Your Business)
export interface KYBStepConfig {
  // Informations de l'entreprise
  companyInfo: boolean;
  
  // Informations du représentant légal
  representativeInfo: boolean;
  
  // Vérifications
  emailVerification: boolean;
  phoneVerification: boolean;
  
  // Adresse
  addressInfo: boolean;
  
  // Documents d'entreprise
  businessDocType: boolean;
  businessDocCapture: boolean;
  
  // Documents d'identité du représentant
  idDocSelection: boolean;
  idDocNumber: boolean;
  idDocRectoCapture: boolean;
  idDocVersoCapture: boolean;
  
  // Justificatif de domicile du représentant
  addressDocSelection: boolean;
  addressDocCapture: boolean;
  
  // Vérification biométrique
  mobileOption: boolean; // Cette étape est toujours activée dans la config, mais sera sautée automatiquement sur mobile
  selfieCapture: boolean;
  livenessDetection: boolean;
}

// Configuration par défaut (toutes les étapes activées)
export const defaultKYBConfig: KYBStepConfig = {
  companyInfo: true,
  representativeInfo: true,
  emailVerification: true,
  phoneVerification: true,
  addressInfo: true,
  businessDocType: true,
  businessDocCapture: true,
  idDocSelection: true,
  idDocNumber: true,
  idDocRectoCapture: true,
  idDocVersoCapture: true,
  addressDocSelection: true,
  addressDocCapture: true,
  mobileOption: true, // Obligatoire dans la configuration, mais sera ignoré sur mobile
  selfieCapture: true,
  livenessDetection: true
};

// Fonctions utilitaires
export function getActiveKYBSteps(config: KYBStepConfig = defaultKYBConfig): string[] {
  const steps: string[] = [];
  
  if (config.companyInfo) steps.push('companyInfo');
  if (config.representativeInfo) steps.push('representativeInfo');
  if (config.emailVerification) steps.push('emailVerification');
  if (config.phoneVerification) steps.push('phoneVerification');
  if (config.addressInfo) steps.push('addressInfo');
  if (config.businessDocType) steps.push('businessDocType');
  if (config.businessDocCapture) steps.push('businessDocCapture');
  if (config.idDocSelection) steps.push('idDocSelection');
  if (config.idDocNumber) steps.push('idDocNumber');
  if (config.idDocRectoCapture) steps.push('idDocRectoCapture');
  if (config.idDocVersoCapture) steps.push('idDocVersoCapture');
  if (config.addressDocSelection) steps.push('addressDocSelection');
  if (config.addressDocCapture) steps.push('addressDocCapture');
  if (config.mobileOption) steps.push('mobileOption'); // Toujours inclus dans les étapes actives selon la config
  if (config.selfieCapture) steps.push('selfieCapture');
  if (config.livenessDetection) steps.push('livenessDetection');
  
  return steps;
}

// Exemples de configurations prédéfinies
export const minimalKYBConfig: KYBStepConfig = {
  companyInfo: true,
  representativeInfo: true,
  emailVerification: false,
  phoneVerification: false,
  addressInfo: true,
  businessDocType: true,
  businessDocCapture: true,
  idDocSelection: true,
  idDocNumber: true,
  idDocRectoCapture: true,
  idDocVersoCapture: false,
  addressDocSelection: false,
  addressDocCapture: false,
  mobileOption: true, // Toujours obligatoire dans la config
  selfieCapture: false,
  livenessDetection: false
};

export const standardKYBConfig: KYBStepConfig = {
  companyInfo: true,
  representativeInfo: true,
  emailVerification: true,
  phoneVerification: false,
  addressInfo: true,
  businessDocType: true,
  businessDocCapture: true,
  idDocSelection: true,
  idDocNumber: true,
  idDocRectoCapture: true,
  idDocVersoCapture: true,
  addressDocSelection: true,
  addressDocCapture: true,
  mobileOption: true, // Toujours obligatoire dans la config
  selfieCapture: true,
  livenessDetection: false
};

export const enhancedKYBConfig: KYBStepConfig = {
  ...defaultKYBConfig
};