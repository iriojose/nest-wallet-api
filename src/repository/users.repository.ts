import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../lib/prisma.service';
import { UserDocumentAndPhone } from '../validations/schemas/users';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService){}

    async getUsers(): Promise<Prisma.UserGetPayload<{include: { payments: true }}>[]> {
        return await this.prisma.user.findMany({
            include: { payments: true }
        })
    }

    async getUser(id: string):Promise<Prisma.UserGetPayload<{include: { payments: true }}>> {
        return await this.prisma.user.findFirst({
            where: { id },
            include: { payments: true }
        })
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { email }
        })
    }

    async getUserByDocumentAndPhone({ document, phone }: UserDocumentAndPhone): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                document,
                phone
            }
        })
    }

    async updateUser(data: Prisma.UserUpdateInput) {
        return await this.prisma.user.update({
            data,
            where: { id: data.id as string}
        })
    }
    
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return await this.prisma.user.create({ data })
    }
}