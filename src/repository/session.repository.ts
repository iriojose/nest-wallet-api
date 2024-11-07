import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma.service';

@Injectable()
export class SessionRepository {
    constructor(private prisma: PrismaService){}

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