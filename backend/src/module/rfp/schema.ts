import z from 'zod';

export const generateRfpSchema = z.object({
  text: z.string().min(1, 'Text is required'),
});
