import { Module } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../lib/prisma.service';

@Module({
  providers: [UsersRepository, UsersService, PrismaService],
  controllers: [UsersController],
})
export class UsersModule {}
