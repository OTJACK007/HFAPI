import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  addressLine: z.string().min(5, 'Adresse invalide'),
  city: z.string().min(2, 'Ville invalide'),
  country: z.string().min(2, 'Pays invalide'),
  documentType: z.enum(['id', 'passport', 'residence', 'license'], {
    required_error: 'Veuillez sélectionner un type de document',
  }),
});

export type FormData = z.infer<typeof formSchema>;