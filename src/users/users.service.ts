import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma, User } from '@prisma/client';
import { AddBalance, UserDocumentAndPhone } from 'src/validations/schemas/users';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository){}

    async getUsers(): Promise<User[]>{
        return this.usersRepository.getUsers()
    }

    async checkBalance(data :UserDocumentAndPhone): Promise<number> {
        const user = await this.usersRepository.getUserByDocumentAndPhone(data)
        if(!user) throw new NotFoundException("User not found")

        return user.balance
    }

    async addBalance(data: AddBalance): Promise<number> {
        const user = await this.usersRepository.getUserByDocumentAndPhone(data)
        if(!user) throw new NotFoundException("User not found")

        const updateUser = await this.usersRepository.updateBalance(data.balance, user.id)
        return updateUser.balance
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.usersRepository.createUser(data)
    }
}
