import { Injectable } from '@nestjs/common';
import { Prisma, Payment } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma.service';


@Injectable()
export class PaymentRepository {
    constructor(private prisma: PrismaService){}

    async getPaymentsByUserId(id: string): Promise<Payment[]> {
        return await this.prisma.payment.findMany({
            where: { 
                user: { id }
            }
        })
    }

    async createPayment({ amount, token, userId }: { amount: number, token: string, userId: string }) {
        return await this.prisma.payment.create({
            data: {
                amount,
                token,
                userId,
            }
        })
    }

}