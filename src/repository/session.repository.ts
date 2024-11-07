import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class SessionRepository {
    constructor(private prisma: PrismaService){}

    async getSession(id: string) {
        return await this.prisma.session.findFirst({
            where: { id },
            include: { 
                payment: true,
                user: true
            }
        })
    }

    async createSession({ token, userId, paymentId }: { token: string, userId: string, paymentId: string}) {
        return await this.prisma.session.create({
            data: {
                token,
                userId,
                paymentId,
                expiresAt: new Date(Date.now() + 15 * 60000) //15 minutos
            }
        })
    }
}