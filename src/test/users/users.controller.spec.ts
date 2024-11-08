import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from '../../modules/users/users.controller';
import { UsersService } from '../../modules/users/users.service';
import * as data from "./data.json" 

describe("Users Controller", () => {
    let usersController: UsersController;
    let usersService: UsersService;
    
    beforeEach(async() => {
        const moduleRef = await Test.createTestingModule({
			controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        getUsers: jest.fn().mockResolvedValue(data.getUsers),
                        checkBalance: jest.fn().mockResolvedValue(20),
                        addBalance: jest.fn().mockResolvedValue(32),
                        createUser: jest.fn().mockResolvedValue(data.createUser)
                    },
                },
            ]
        }).compile()

        usersController = moduleRef.get<UsersController>(UsersController);
        usersService = moduleRef.get<UsersService>(UsersService);
    })


    describe("users functions controllers",() => {

        it("return a list of users", async() => {
            const expected = data.getUsers
			const users = await usersController.getUsers()

            expect(usersService.getUsers).toHaveBeenCalled();
            expect(expected).toEqual(users)
        })

        it("return balance of user", async() => {
            const expected = 20
            const balance = await usersController.checkBalance(data.bodys.checkBalance)

            expect(usersService.checkBalance).toHaveBeenCalled();
            expect(usersService.checkBalance).toHaveBeenCalledWith(data.bodys.checkBalance);
            expect(expected).toEqual(balance)
        })

        it("return error if user not found", async() => {
            jest.spyOn(usersService, 'checkBalance').mockImplementation(() => {
				throw new NotFoundException("User not found");
			});

            try {
                await usersController.checkBalance(data.bodys.checkBalance)
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.getStatus()).toBe(404);
                expect(e.response.message).toEqual("User not found")
            }
        })

        it("returns the sum of the previous balance with the new", async() => {
            const expected = 32
            const balance = await usersController.addBalance(data.bodys.addBalance)

            expect(usersService.addBalance).toHaveBeenCalled();
            expect(usersService.addBalance).toHaveBeenCalledWith(data.bodys.addBalance);
            expect(expected).toEqual(balance)
        })

        it("return error if user not found", async() => {
            jest.spyOn(usersService, 'addBalance').mockImplementation(() => {
				throw new NotFoundException("User not found");
			});

            try {
                await usersController.addBalance(data.bodys.addBalance)
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.getStatus()).toBe(404);
                expect(e.response.message).toEqual("User not found")
            }
        })

        it("create user", async() => {
            const expected = data.createUser
            const user = await usersController.createUser(data.bodys.createUser)

            expect(usersService.createUser).toHaveBeenCalled();
            expect(usersService.createUser).toHaveBeenCalledWith(data.bodys.createUser);
            expect(expected).toEqual(user)
        })
    })
})