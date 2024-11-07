import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/lib/prisma.service';

@Module({
  providers: [UsersRepository, UsersService, PrismaService],
  controllers: [UsersController],
})
export class UsersModule {}
