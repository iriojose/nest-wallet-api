import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UsersService } from './users.service';
import { createUserSchema } from 'src/validations/schemas/users';
import { ZodValidationPipe } from 'src/validations/validation.pipe';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get('/')
    async getUsers(): Promise<User[]>{
        return await this.usersService.getUsers()
    }
    
    @UsePipes(new ZodValidationPipe(createUserSchema))
    @Post('create')
    async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
        return await this.usersService.createUser(data)
    }
}
