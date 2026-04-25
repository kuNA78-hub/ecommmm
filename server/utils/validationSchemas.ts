import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['seller', 'buyer', 'employee']),
    inviteToken: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const productSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    images: z.array(z.string()).optional(),
    description: z.string().optional()
});

export const orderItemsSchema = z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive(),
});

export const orderSchema = z.object({
    items: z.array(orderItemsSchema),
    totalAmount: z.number(),
    shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        zip: z.string(),
    })
});


