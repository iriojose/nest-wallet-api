import { z } from 'zod';
import { ZodValidationPipe } from '../validation.pipe';

//schemas
export const createUserSchema = z.object({
    document: z
        .string()
        .min(6, "The document must be at least 6 characters")
        .max(20, "The document cannot exceed 20 characters"),
        
    firstName: z
        .string()
        .min(2, "The name must be at least 2 characters")
        .max(50, "The name cannot exceed 50 characters"),
        
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "The last name cannot exceed 50 characters"),
        
    email: z
        .string()
        .email("The email must be a valid address"),
        
    phone: z
        .string()
        .min(7, "The phone number must be at least 7 characters")
        .max(15, "The phone cannot exceed 15 characters")
        .regex(/^\+?[0-9\s-]*$/, "Phone can only contain numbers, spaces and hyphens"),
});

export const userDocumentAndPhoneSchema = z.object({
    document: z
        .string()
        .min(6, "The document must be at least 6 characters")
        .max(20, "The document cannot exceed 20 characters"),

    phone: z
        .string()
        .min(7, "The phone number must be at least 7 characters")
        .max(15, "The phone cannot exceed 15 characters")
        .regex(/^\+?[0-9\s-]*$/, "Phone can only contain numbers, spaces and hyphens"),
})

export const addBalanceShema = userDocumentAndPhoneSchema.extend({
    balance: z
        .number() 
        .positive("The balance must be a positive number") 
        .min(0.01, "The balance must be greater than 0"),
})

//types
export type UserDocumentAndPhone = z.TypeOf<typeof userDocumentAndPhoneSchema>
export type AddBalance = z.TypeOf<typeof addBalanceShema>

//validations pipes
export const createUserValidation = new ZodValidationPipe(createUserSchema)
export const userDocumentAndPhoneValidation = new ZodValidationPipe(userDocumentAndPhoneSchema)
export const addBalanceValidations = new ZodValidationPipe(addBalanceShema)