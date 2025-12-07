import z from 'zod';

export const createVendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  // categories: z.array(z.string()).optional() // Potentially handle category IDs here
});

export const updateVendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const paginationSchema = z.object({
  limit: z.number().min(1).optional(),
  page: z.number().min(1).optional(),
});

export const notifyVendorSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
});
