import { Test } from '@nestjs/testing';
import { PaymentService } from '../../modules/payment/payment.service';
import { PaymentRepository } from '../../repository/payment.repository';
import { UsersRepository } from '../../repository/users.repository';
import { SessionRepository } from '../../repository/session.repository';
import { MailService } from '../../lib/mail.service';
import * as paymentData from "./data.json" 
import * as userData from "../users/data.json"
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe("Payment Service", () => { 
    let paymentService: PaymentService ;
    let paymentRepository: PaymentRepository;
    let usersRepository: UsersRepository
    let sessionRepository: SessionRepository
    let mailService: MailService

    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: PaymentRepository,
                    useValue: {
                        createPayment: jest.fn().mockReturnValue(paymentData.repository.createPayment),
                        updatePaymentConfirm: jest.fn().mockReturnValue(null)
                    },
                },
                {
                    provide: UsersRepository,
                    useValue: {
                        getUserByEmail: jest.fn().mockReturnValue(userData.repository.getUserByEmail),
                        updateUser: jest.fn().mockReturnValue(null)
                    }
                },
                {
                    provide: SessionRepository,
                    useValue: {
                        createSession: jest.fn().mockReturnValue(paymentData.repository.createSession),
                        getSession: jest.fn().mockReturnValue(null)
                    }
                },{
                    provide: MailService,
                    useValue: {
                        sendMail: jest.fn().mockReturnValue(null)
                    }
                }
            ]
        }).compile()

        paymentService = moduleRef.get<PaymentService>(PaymentService);
        paymentRepository = moduleRef.get<PaymentRepository>(PaymentRepository);
        usersRepository = moduleRef.get<UsersRepository>(UsersRepository)
        sessionRepository = moduleRef.get<SessionRepository>(SessionRepository)
        mailService = moduleRef.get<MailService>(MailService)
    })

    describe("payment funtions service", () => {
        
        it("return a data for a validation of pay", async() => {
            await paymentService.pay(paymentData.bodys.pay)

            expect(usersRepository.getUserByEmail).toHaveBeenCalled();
            expect(usersRepository.getUserByEmail).toHaveBeenCalledWith(paymentData.bodys.pay.email);
            expect(paymentRepository.createPayment).toHaveBeenCalled();
            expect(sessionRepository.createSession).toHaveBeenCalled();
            expect(mailService.sendMail).toHaveBeenCalled();
        })

        it("return error if user not found", async() => {
            jest.spyOn(usersRepository, 'getUserByEmail').mockResolvedValue(null);
    
            try {
                await paymentService.pay(paymentData.bodys.pay)
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.getStatus()).toBe(404);
                expect(e.response.message).toEqual("User not found")
            }
        })
    
        it("return error if insufficient balance", async() => {
            try {
                await paymentService.pay(paymentData.bodys.pay2)
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.getStatus()).toBe(400);
                expect(e.response.message).toEqual("insufficient balance")
            }
        })

        it("return a confirmation of pay", async() => {
            let getSession = paymentData.repository.getSession
            getSession.expiresAt = new Date().setMinutes(59).toString()

            jest.spyOn(sessionRepository, 'getSession').mockResolvedValue(getSession as any);
            await paymentService.confirm(paymentData.bodys.confirm)

            expect(sessionRepository.getSession).toHaveBeenCalled();
            expect(paymentRepository.updatePaymentConfirm).toHaveBeenCalled();
            expect(usersRepository.updateUser).toHaveBeenCalled();
        })

        it("return error if the session is invalid or token invalid", async() => {
            try {
                await paymentService.confirm(paymentData.bodys.confirm)
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.getStatus()).toBe(400);
                expect(e.response.message).toEqual("Invalid or expired session or token")
            }
        })

        it("return error if the payment is failed or confirmed", async() => {
            let getSession = paymentData.repository.getSession
            getSession.expiresAt = new Date().setMinutes(59).toString()
            getSession.payment.status = "CONFIRMED"
            jest.spyOn(sessionRepository, 'getSession').mockResolvedValue(getSession as any);

            try {
                await paymentService.confirm(paymentData.bodys.confirm)
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.getStatus()).toBe(400);
                expect(e.response.message).toEqual("The payment has already been confirmed or failed")
            }
        })

        it("return error if the amount is greater than balance", async() => {
            let getSession = paymentData.repository.getSession
            getSession.expiresAt = new Date().setMinutes(59).toString()
            getSession.payment.amount = 1000
            getSession.payment.status = "PENDING"
            jest.spyOn(sessionRepository, 'getSession').mockResolvedValue(getSession as any);

            try {
                await paymentService.confirm(paymentData.bodys.confirm)
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.getStatus()).toBe(400);
                expect(e.response.message).toEqual("The balance is insufficient to process the payment")
            }
        })
    })
})