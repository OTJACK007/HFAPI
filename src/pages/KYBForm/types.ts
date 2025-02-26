import { z } from 'zod';

export const formSchema = z.object({
  // Company Information
  companyName: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères'),
  registrationNumber: z.string().min(1, 'Le numéro SIREN/SIRET est requis'),
  vatNumber: z.string().optional(),
  industry: z.string().min(2, 'Le secteur d\'activité est requis'),
  
  // Company Address
  addressLine: z.string().min(5, 'Adresse invalide'),
  city: z.string().min(2, 'Ville invalide'),
  country: z.string().min(2, 'Pays invalide'),
  
  // Legal Representative
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  position: z.string().min(2, 'Le poste est requis'),
  
  // Document Types
  businessDocType: z.enum(['kbis', 'registration', 'articles', 'tax'], {
    required_error: 'Veuillez sélectionner un type de document',
  }),
  documentType: z.enum(['id', 'passport', 'residence', 'license'], {
    required_error: 'Veuillez sélectionner un type de document',
  }),
});

export type FormData = z.infer<typeof formSchema>;