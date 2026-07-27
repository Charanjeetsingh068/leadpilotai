import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty'),
  mediaUrl: z.string().url('Invalid media URL').optional().or(z.literal('')),
});

export const toggleAiSchema = z.object({
  isAiAutomated: z.boolean(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ToggleAiInput = z.infer<typeof toggleAiSchema>;
