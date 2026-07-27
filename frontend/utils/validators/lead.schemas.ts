import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  source: z.enum(['FACEBOOK_ADS', 'INSTAGRAM_ADS', 'GOOGLE_ADS', 'WEBSITE_FORM', 'MANUAL_ENTRY']),
  notes: z.string().optional(),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
