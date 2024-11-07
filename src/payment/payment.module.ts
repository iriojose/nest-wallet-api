import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UsersRepository } from '../repository/users.repository';
import { PaymentRepository } from 'src/repository/payment.repository';
import { SessionRepository } from 'src/repository/session.repository';
import { PrismaService } from 'src/lib/prisma.service';
import { MailService } from 'src/lib/main.service';

@Module({
  providers: [UsersRepository, PaymentRepository, SessionRepository, PaymentService, PrismaService, MailService],
  controllers: [PaymentController]
})
export class PaymentModule {}
