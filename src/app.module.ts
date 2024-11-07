import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './lib/prisma.service';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
