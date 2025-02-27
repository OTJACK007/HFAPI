// Configuration des champs visibles pour KYB (Know Your Business)

export interface KYBFieldConfig {
  // Champs d'informations de l'entreprise
  companyInfo: {
    companyName: boolean;       // Toujours true (obligatoire)
    registrationNumber: boolean; // Toujours true (obligatoire)
    website: boolean;           // Toujours true (obligatoire)
    vatNumber: boolean;
    industry: boolean;
    incorporationDate: boolean;
    employeeCount: boolean;
    annualRevenue: boolean;
  };
  
  // Informations du représentant
  representativeInfo: {
    firstName: boolean;  // Toujours true (obligatoire)
    lastName: boolean;   // Toujours true (obligatoire)
    position: boolean;   // Toujours true (obligatoire)
    email: boolean;
    phone: boolean;
    additionalInfo: boolean;
  };
  
  // Champs d'adresse
  addressInfo: {
    addressLine: boolean; // Toujours true (obligatoire)
    city: boolean;        // Toujours true (obligatoire)
    country: boolean;     // Toujours true (obligatoire)
    postalCode: boolean;
    state: boolean;
  };

  // Types de documents d'entreprise disponibles
  businessDocTypes: {
    kbis: boolean;          // Extrait Kbis
    registration: boolean;  // Certificat d'immatriculation
    articles: boolean;      // Statuts de l'entreprise
    tax: boolean;           // Attestation fiscale
  };

  // Types de documents d'identité du représentant
  representativeDocTypes: {
    id: boolean;        // Carte d'identité
    passport: boolean;  // Passeport
    residence: boolean; // Titre de séjour
    license: boolean;   // Permis de conduire
  };
  
  // Types de justificatifs de domicile de l'entreprise
  businessAddressDocTypes: {
    bill: boolean;          // Facture (électricité, eau, etc.)
    certificate: boolean;   // Attestation de domicile
    bankStatement: boolean; // Relevé bancaire
    leaseAgreement: boolean; // Contrat de bail
  };
  
  // Options de capture de documents
  documentCapture: {
    allowDocumentUpload: boolean;         // Permettre l'upload de document du représentant (vs uniquement capture caméra)
    allowCompanyDocumentUpload: boolean;  // Permettre l'upload de document d'entreprise (vs uniquement capture caméra)
    allowAddressDocumentUpload: boolean;  // Permettre l'upload de justificatif de domicile
  };
}

// Configuration par défaut (tous les champs sont visibles)
export const defaultKYBFieldConfig: KYBFieldConfig = {
  companyInfo: {
    companyName: true,        // Obligatoire
    registrationNumber: true, // Obligatoire
    website: true,            // Obligatoire
    vatNumber: true,
    industry: true,
    incorporationDate: true,
    employeeCount: true,
    annualRevenue: true
  },
  representativeInfo: {
    firstName: true,  // Obligatoire
    lastName: true,   // Obligatoire
    position: true,   // Obligatoire
    email: true,
    phone: true,
    additionalInfo: false
  },
  addressInfo: {
    addressLine: true, // Obligatoire
    city: true,        // Obligatoire
    country: true,     // Obligatoire
    postalCode: true,
    state: true
  },
  businessDocTypes: {
    kbis: true,
    registration: true,
    articles: true,
    tax: true
  },
  representativeDocTypes: {
    id: true,
    passport: true,
    residence: true,
    license: true
  },
  businessAddressDocTypes: {
    bill: true,
    certificate: true,
    bankStatement: true,
    leaseAgreement: true
  },
  documentCapture: {
    allowDocumentUpload: true,
    allowCompanyDocumentUpload: true,
    allowAddressDocumentUpload: true
  }
};

// Configurations prédéfinies
export const minimalKYBFieldConfig: KYBFieldConfig = {
  companyInfo: {
    companyName: true,        // Obligatoire
    registrationNumber: true, // Obligatoire
    website: true,            // Obligatoire
    vatNumber: false,
    industry: true,
    incorporationDate: false,
    employeeCount: false,
    annualRevenue: false
  },
  representativeInfo: {
    firstName: true,  // Obligatoire
    lastName: true,   // Obligatoire
    position: true,   // Obligatoire
    email: true,
    phone: true,
    additionalInfo: false
  },
  addressInfo: {
    addressLine: true, // Obligatoire
    city: true,        // Obligatoire
    country: true,     // Obligatoire
    postalCode: false,
    state: false
  },
  businessDocTypes: {
    kbis: true,
    registration: true,
    articles: false,
    tax: false
  },
  representativeDocTypes: {
    id: true,
    passport: true,
    residence: false,
    license: false
  },
  businessAddressDocTypes: {
    bill: true,
    certificate: false,
    bankStatement: false,
    leaseAgreement: true
  },
  documentCapture: {
    allowDocumentUpload: false,
    allowCompanyDocumentUpload: false,
    allowAddressDocumentUpload: false
  }
};

export const standardKYBFieldConfig: KYBFieldConfig = {
  companyInfo: {
    companyName: true,        // Obligatoire
    registrationNumber: true, // Obligatoire
    website: true,            // Obligatoire
    vatNumber: true,
    industry: true,
    incorporationDate: true,
    employeeCount: true,
    annualRevenue: false
  },
  representativeInfo: {
    firstName: true,  // Obligatoire
    lastName: true,   // Obligatoire
    position: true,   // Obligatoire
    email: true,
    phone: true,
    additionalInfo: false
  },
  addressInfo: {
    addressLine: true, // Obligatoire
    city: true,        // Obligatoire
    country: true,     // Obligatoire
    postalCode: true,
    state: false
  },
  businessDocTypes: {
    kbis: true,
    registration: true,
    articles: true,
    tax: false
  },
  representativeDocTypes: {
    id: true,
    passport: true,
    residence: true,
    license: false
  },
  businessAddressDocTypes: {
    bill: true,
    certificate: true,
    bankStatement: true,
    leaseAgreement: true
  },
  documentCapture: {
    allowDocumentUpload: true,
    allowCompanyDocumentUpload: true,
    allowAddressDocumentUpload: true
  }
};