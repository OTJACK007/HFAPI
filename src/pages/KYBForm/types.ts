import { z } from 'zod';

export const formSchema = z.object({
  // Company Information
  companyName: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères'),
  registrationNumber: z.string().min(1, 'Le numéro SIREN/SIRET est requis'),
  vatNumber: z.string().optional(),
  industry: z.string().min(2, 'Le secteur d\'activité est requis'),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  incorporationDate: z.string().min(1, 'La date de création est requise'),
  employeeCount: z.string().min(1, 'Le nombre d\'employés est requis'),
  annualRevenue: z.string().min(1, 'Le chiffre d\'affaires est requis'),
  
  // Company Address
  addressLine: z.string().min(5, 'Adresse invalide'),
  city: z.string().min(2, 'Ville invalide'),
  country: z.string().min(2, 'Pays invalide'),
  postalCode: z.string().optional(),
  state: z.string().optional(),
  
  // Legal Representative
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  position: z.string().min(2, 'Le poste est requis'),
  additionalInfo: z.string().optional(),
  
  // Document Types
  businessDocType: z.enum(['kbis', 'registration', 'articles', 'tax'], {
    required_error: 'Veuillez sélectionner un type de document',
  }),
  documentType: z.enum(['id', 'passport', 'residence', 'license'], {
    required_error: 'Veuillez sélectionner un type de document',
  }),
  documentNumber: z.string().min(5, 'Numéro de document invalide'),
  
  // Type de justificatif de domicile
  addressDocType: z.enum(['bill', 'certificate', 'bankStatement', 'leaseAgreement'], {
    required_error: 'Veuillez sélectionner un type de justificatif de domicile',
  }).optional(),
});

export type FormData = z.infer<typeof formSchema>;