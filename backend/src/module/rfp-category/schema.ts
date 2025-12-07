import z from 'zod';

export const createRfpCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const updateRfpCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});
