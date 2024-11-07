import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/repository/users.repository';
import { PaymentRepository } from 'src/repository/payment.repository';
import { SessionRepository } from 'src/repository/session.repository';
import { Pay } from 'src/validations/schemas/payment';

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
        
        return { sessionId: session.id, token, message: "el token fue enviado al correo electronico"};
    }
}
