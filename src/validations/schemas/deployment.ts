import { z } from 'zod';

export const deploymentValidationSchema = z.object({
    DATABASE_URL: z.string().min(1, { message: "DATABASE_URL is required" }),
    SENDGRID_API: z.string().min(1, { message: "SENDGRID_API_KEY is required" }),
    EMAIL: z.string().min(1, { message: "EMAIL is required" }),
    HOST: z.string().min(1, { message: "HOST is required" }),
    USER: z.string().min(1, { message: "USER is required" }),
    PORT: z.string().min(1, { message: "PORT is required" }),
})