import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository){}

    async getUsers(): Promise<User[]>{
        return this.usersRepository.getUsers()
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.usersRepository.createUser(data)
    }
}
