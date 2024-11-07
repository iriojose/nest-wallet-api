import { z } from 'zod';

export const createUserSchema = z.object({
    document: z
        .string()
        .min(6, "El documento debe tener al menos 6 caracteres")
        .max(20, "El documento no puede exceder los 20 caracteres"),
        
    firstName: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder los 50 caracteres"),
        
    lastName: z
        .string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido no puede exceder los 50 caracteres"),
        
    email: z
        .string()
        .email("El email debe ser una dirección válida"),
        
    phone: z
        .string()
        .min(7, "El teléfono debe tener al menos 7 caracteres")
        .max(15, "El teléfono no puede exceder los 15 caracteres")
        .regex(/^\+?[0-9\s-]*$/, "El teléfono solo puede contener números, espacios y guiones"),
});