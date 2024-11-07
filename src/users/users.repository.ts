import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService){}

    async getUsers(): Promise<User[]> {
        return await this.prisma.user.findMany()
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return await this.prisma.user.create({ data })
    }
}