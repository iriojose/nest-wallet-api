import { Injectable } from '@nestjs/common';
import { Prisma, Payment } from '@prisma/client';
import { PrismaService } from '../lib/prisma.service';


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

    async updatePaymentConfirm(data: Prisma.PaymentUpdateInput) {
        return await this.prisma.payment.update({ 
            data,
            where: { id: data.id as string}
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