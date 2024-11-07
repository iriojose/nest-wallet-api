import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    constructor() { //globals omits 
        super() 
    }
    
    async onModuleInit() {
        await this.$connect()
    }
}

