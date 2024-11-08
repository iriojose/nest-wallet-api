import { Controller, Get, Post, Body, UsePipes, Param } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UsersService } from './users.service';
import { 
    createUserValidation, 
    userDocumentAndPhoneValidation, 
    UserDocumentAndPhone, 
    addBalanceValidations, 
    AddBalance 
} from '../../validations/schemas/users';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get('/')
    async getUsers(): Promise<Prisma.UserGetPayload<{include: { payments: true }}>[]>{
        return await this.usersService.getUsers()
    }

    @Get('/:id')
    async getUser(@Param() param: {id: string}):Promise<Prisma.UserGetPayload<{include: { payments: true }}>> {
        return await this.usersService.getUser(param.id)
    }   

    @UsePipes(createUserValidation)
    @Post('create')
    async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
        return await this.usersService.createUser(data)
    }

    @UsePipes(userDocumentAndPhoneValidation)
    @Post('check-Balance')
    async checkBalance(@Body() data: UserDocumentAndPhone): Promise<number> {
        return await this.usersService.checkBalance(data)
    }

    @UsePipes(addBalanceValidations)
    @Post('add-balance')
    async addBalance(@Body() data: AddBalance): Promise<number> {
        return await this.usersService.addBalance(data)
    }
}
