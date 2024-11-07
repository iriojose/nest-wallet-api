import { Controller, Post, Body, UsePipes} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Pay, payValidation} from 'src/validations/schemas/payment';

@Controller('payment')
export class PaymentController {

    constructor(
        private paymentService: PaymentService
    ){}

    @UsePipes(payValidation)
    @Post('pay')
    async pay(@Body() data: Pay) {
        return await this.paymentService.pay(data)
    }
}
