import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './lib/prisma.service';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [UsersModule, PaymentModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
