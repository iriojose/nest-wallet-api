import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/repository/users.repository';
import { PaymentRepository } from 'src/repository/payment.repository';
import { SessionRepository } from 'src/repository/session.repository';
import { Pay, ConfirmPay } from 'src/validations/schemas/payment';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {

    constructor(
        private usersRepository: UsersRepository,
        private paymentRepository: PaymentRepository,
        private sessionRepository: SessionRepository
    ) {}

    async pay(data: Pay) {
        const user = await this.usersRepository.getUserByEmail(data.email);
        if(!user) throw new NotFoundException("User not found")
        if(user.balance < data.amount) throw new BadRequestException("insufficient balance") 
            
        const token = Math.floor(100000 + Math.random() * 900000).toString();

        const payment = await this.paymentRepository.createPayment({ amount: data.amount, token, userId: user.id})
        const session = await this.sessionRepository.createSession({ token, paymentId: payment.id, userId: user.id })

        //envio el token solo para probar en postman, debe solo leerse desde el email
        return { sessionId: session.id, token, message: "the token was sent to the email"};
    }

    async confirm(data: ConfirmPay) {
        const session = await this.sessionRepository.getSession(data.sessionId)
        
        if (!session || session.expiresAt < new Date() || session.token !== data.token) {
            throw new BadRequestException('Invalid or expired session or token');
        }

        if (session.payment.status !== PaymentStatus.PENDING) {
            throw new BadRequestException('The payment has already been confirmed or failed');
        }

        if(session.user.balance < session.payment.amount) {
            await this.paymentRepository.updatePaymentConfirm({ 
                status: PaymentStatus.FAILED,
                id: session.payment.id
            })
            throw new BadRequestException('The balance is insufficient to process the payment');
        }

        const newBalance = (session.user.balance - session.payment.amount)
        await this.usersRepository.updateUser({
            id: session.userId,
            balance: newBalance
        })

        await this.paymentRepository.updatePaymentConfirm({
            status: PaymentStatus.CONFIRMED,
            sessionId: session.id,
            id: session.payment.id
        })

        return { message: "Payment completed successfully" }
    }
}
