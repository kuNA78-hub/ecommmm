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

// Security Improvement: Client only needs to send productId and quantity.
// The server will fetch name and price from the database.
export const orderItemsSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
});

export const orderSchema = z.object({
    items: z.array(orderItemsSchema).min(1, 'At least one item is required'),
    shippingAddress: z.object({
        street: z.string().min(1, 'Street is required'),
        city: z.string().min(1, 'City is required'),
        zip: z.string().min(1, 'Zip code is required'),
    })
});
