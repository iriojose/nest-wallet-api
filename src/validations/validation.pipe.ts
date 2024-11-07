import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { z, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown) {
        try {
            this.schema.parse(value);
            return value;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));

                throw new BadRequestException({
                    message: 'Error de validación',
                    errors,
                });
            }

            throw error;
        }
    }
}