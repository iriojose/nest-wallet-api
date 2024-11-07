import z from "zod"
import { ZodValidationPipe } from '../validation.pipe';

export const paySchema = z.object({
    email: z
        .string()
        .email("The email must be a valid address"),
    amount: z
        .number() 
        .positive("The balance must be a positive number") 
        .min(0.01, "The balance must be greater than 0"),
})

export const confirmPaySchema = z.object({
    sessionId: z
        .string(),
    token: z
        .string()
})

export type Pay = z.TypeOf<typeof paySchema>
export type ConfirmPay = z.TypeOf<typeof confirmPaySchema>

export const payValidation = new ZodValidationPipe(paySchema)
export const confirmPayValidation = new ZodValidationPipe(confirmPaySchema)