// Configuration des champs visibles pour KYC (Know Your Customer)

export interface KYCFieldConfig {
  // Champs d'informations de base
  basicInfo: {
    firstName: boolean; // Toujours true (obligatoire)
    lastName: boolean;  // Toujours true (obligatoire)
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

  // Types de documents d'identité disponibles
  documentTypes: {
    id: boolean;        // Carte d'identité
    passport: boolean;  // Passeport
    residence: boolean; // Titre de séjour
    license: boolean;   // Permis de conduire
  };
  
  // Types de justificatifs de domicile disponibles
  addressDocumentTypes: {
    bill: boolean;          // Facture (électricité, eau, etc.)
    certificate: boolean;   // Attestation de domicile
    bankStatement: boolean; // Relevé bancaire
  };
  
  // Options de capture de documents
  documentCapture: {
    allowDocumentUpload: boolean;         // Permettre l'upload de document (vs uniquement capture caméra)
    allowAddressDocumentUpload: boolean;  // Permettre l'upload de justificatif de domicile
  };
}

// Configuration par défaut - tous les champs sont visibles
export const defaultKYCFieldConfig: KYCFieldConfig = {
  basicInfo: {
    firstName: true,   // Obligatoire
    lastName: true,    // Obligatoire
    email: true,
    phone: true,
    additionalInfo: true
  },
  addressInfo: {
    addressLine: true, // Obligatoire
    city: true,        // Obligatoire
    country: true,     // Obligatoire
    postalCode: true,
    state: true
  },
  documentTypes: {
    id: true,
    passport: true,
    residence: true,
    license: true
  },
  addressDocumentTypes: {
    bill: true,
    certificate: true,
    bankStatement: true
  },
  documentCapture: {
    allowDocumentUpload: true,
    allowAddressDocumentUpload: true
  }
};

// Configurations prédéfinies
export const minimalKYCFieldConfig: KYCFieldConfig = {
  basicInfo: {
    firstName: true,   // Obligatoire
    lastName: true,    // Obligatoire
    email: true,
    phone: false,
    additionalInfo: false
  },
  addressInfo: {
    addressLine: true, // Obligatoire
    city: true,        // Obligatoire
    country: true,     // Obligatoire
    postalCode: false,
    state: false
  },
  documentTypes: {
    id: true,
    passport: true,
    residence: false,
    license: false
  },
  addressDocumentTypes: {
    bill: true,
    certificate: false,
    bankStatement: false
  },
  documentCapture: {
    allowDocumentUpload: false,
    allowAddressDocumentUpload: false
  }
};

export const standardKYCFieldConfig: KYCFieldConfig = {
  basicInfo: {
    firstName: true,   // Obligatoire
    lastName: true,    // Obligatoire
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
  documentTypes: {
    id: true,
    passport: true,
    residence: true,
    license: false
  },
  addressDocumentTypes: {
    bill: true,
    certificate: true,
    bankStatement: true
  },
  documentCapture: {
    allowDocumentUpload: true,
    allowAddressDocumentUpload: true
  }
};