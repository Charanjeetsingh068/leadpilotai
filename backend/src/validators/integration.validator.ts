import { z } from 'zod';

export const connectIntegrationSchema = z.object({
  provider: z.enum(['FACEBOOK', 'INSTAGRAM', 'GOOGLE_ADS', 'WHATSAPP']),
  authCode: z.string().optional(),
  redirectUri: z.string().url().optional(),
});

export const disconnectIntegrationSchema = z.object({
  provider: z.enum(['FACEBOOK', 'INSTAGRAM', 'GOOGLE_ADS', 'WHATSAPP']),
  accountId: z.string().uuid().optional(),
});

export const triggerSyncSchema = z.object({
  provider: z.enum(['FACEBOOK', 'INSTAGRAM', 'GOOGLE_ADS', 'WHATSAPP']),
  syncType: z.string().optional(),
});

export const paginationQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  businessId: z.string().optional(),
});
