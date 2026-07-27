import { z } from 'zod';
import { LeadSource, LeadStatus } from '../enums/lead.enums';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  source: z.nativeEnum(LeadSource).default(LeadSource.MANUAL_ENTRY),
  campaign: z.string().optional(),
  project: z.string().optional(),
  industry: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus),
});

export const assignLeadSchema = z.object({
  salesUserId: z.string().min(1, 'Sales user ID is required'),
  reason: z.string().optional(),
});

export const addNoteSchema = z.object({
  noteText: z.string().min(1, 'Note text cannot be empty'),
});

export const leadQuerySchema = z.object({
  source: z.nativeEnum(LeadSource).optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  industry: z.string().optional(),
  project: z.string().optional(),
  assignedSalesUser: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type AssignLeadInput = z.infer<typeof assignLeadSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
