import z from "zod"
import { ZodValidationPipe } from '../validation.pipe';

export const paySchema = z.object({
    email: z
        .string()
        .email("El email debe ser una dirección válida"),
    amount: z
        .number() 
        .positive("El balance debe ser un número positivo") 
        .min(0.01, "El balance debe ser mayor a 0"),
})

export type Pay = z.TypeOf<typeof paySchema>


export const payValidation = new ZodValidationPipe(paySchema)