import { z } from 'zod'

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  variant: z.string().optional().nullable(),
})

export const ShippingAddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().optional().nullable(),
  address1: z.string().min(1),
  address2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().optional().nullable(),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
})

export const OrderCreateSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(['credit_card', 'bank_transfer']),
})

export const OrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'pending_payment',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ]),
})

export const ProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative().optional(),
  categoryId: z.string().min(1).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
})

export const ProductCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative().default(0),
  categoryId: z.string().min(1),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  images: z.array(z.string().url()).min(1),
})

export const AdminNoteSchema = z.object({
  message: z.string().trim().min(1).max(2000),
})

export function zodErrorToFields(error: z.ZodError) {
  return error.issues.map((err) => ({
    field: err.path[0],
    message: err.message,
  }))
}
