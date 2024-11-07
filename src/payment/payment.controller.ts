import { Controller, Post, Body, UsePipes} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Pay, payValidation, ConfirmPay, confirmPayValidation } from 'src/validations/schemas/payment';

@Controller('payment')
export class PaymentController {

    constructor(
        private paymentService: PaymentService
    ){}

    @UsePipes(payValidation)
    @Post('/')
    async pay(@Body() data: Pay) {
        return await this.paymentService.pay(data)
    }

    @UsePipes(confirmPayValidation)
    @Post('confirm')
    async confirmPay(@Body() data: ConfirmPay) {
        return await this.paymentService.confirm(data)
    }
}
