import { Test } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentController } from '../../modules/payment/payment.controller';
import { PaymentService } from '../../modules/payment/payment.service';
import * as data from "./data.json" 

describe("Payment Controller", () => {
    let paymentController: PaymentController ;
    let paymentService: PaymentService;
    
    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
			controllers: [PaymentController],
            providers: [
                {
                    provide: PaymentService,
                    useValue: {
                        pay: jest.fn().mockReturnValue(data.pay),
                        confirm: jest.fn().mockReturnValue(data.confirm)
                    },
                },
            ]
        }).compile()

        paymentController = moduleRef.get<PaymentController>(PaymentController);
        paymentService = moduleRef.get<PaymentService>(PaymentService);
    })


    describe("payment functions controllers",() => {
        it("create session and payment for a pay", async() => {
            const expected = data.pay
            const value = await paymentController.pay(data.bodys.pay)

            expect(paymentService.pay).toHaveBeenCalled();
            expect(paymentService.pay).toHaveBeenCalledWith(data.bodys.pay);
            expect(expected).toEqual(value)
        })

        it("return error if user not found", async() => {
            jest.spyOn(paymentService, 'pay').mockImplementation(() => {
				throw new NotFoundException("User not found");
			});

            try {
                await paymentController.pay(data.bodys.pay)
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.getStatus()).toBe(404);
                expect(e.response.message).toEqual("User not found")
            }
        })

        it("return error if user amount is greater than balance", async() => {
            jest.spyOn(paymentService, 'pay').mockImplementation(() => {
				throw new BadRequestException("insufficient balance");
			});

            try {
                await paymentController.pay(data.bodys.pay)
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.getStatus()).toBe(400);
                expect(e.response.message).toEqual("insufficient balance")
            }
        })

        it("return the confirmation of pay", async() => {
            const expected = data.confirm
            const value = await paymentController.confirmPay(data.bodys.confirm)

            expect(paymentService.confirm).toHaveBeenCalled();
            expect(paymentService.confirm).toHaveBeenCalledWith(data.bodys.confirm);
            expect(expected).toEqual(value)
        })

        it("return error if invalid or expired session or token", async() => {
            jest.spyOn(paymentService, 'confirm').mockImplementation(() => {
				throw new BadRequestException("Invalid or expired session or token");
			});

            try {
                await paymentController.confirmPay(data.bodys.confirm)
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.getStatus()).toBe(400);
                expect(e.response.message).toEqual("Invalid or expired session or token")
            }
        })

        it("return error if the payment is diferent to pending", async() => {
            jest.spyOn(paymentService, 'confirm').mockImplementation(() => {
				throw new BadRequestException("The payment has already been confirmed or failed");
			});

            try {
                await paymentController.confirmPay(data.bodys.confirm)
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.getStatus()).toBe(400);
                expect(e.response.message).toEqual("The payment has already been confirmed or failed")
            }
        })

        it("return error if the balance is unsufficient", async() => {
            jest.spyOn(paymentService, 'confirm').mockImplementation(() => {
				throw new BadRequestException("The balance is insufficient to process the payment");
			});

            try {
                await paymentController.confirmPay(data.bodys.confirm)
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.getStatus()).toBe(400);
                expect(e.response.message).toEqual("The balance is insufficient to process the payment")
            }
        })
    })

    
})