import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma.service';
import { UserDocumentAndPhone } from 'src/validations/schemas/users';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService){}

    async getUsers(): Promise<User[]> {
        return await this.prisma.user.findMany()
    }

    async getUserByDocumentAndPhone({ document, phone }: UserDocumentAndPhone): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                document,
                phone
            }
        })
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return await this.prisma.user.create({ data })
    }
}