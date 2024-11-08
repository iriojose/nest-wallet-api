import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UsersRepository } from '../../repository/users.repository';
import { PaymentRepository } from '../../repository/payment.repository';
import { SessionRepository } from '../../repository/session.repository';
import { PrismaService } from '../../lib/prisma.service';
import { MailService } from '../../lib/mail.service';

@Module({
  providers: [UsersRepository, PaymentRepository, SessionRepository, PaymentService, PrismaService, MailService],
  controllers: [PaymentController]
})
export class PaymentModule {}
