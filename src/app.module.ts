import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './lib/prisma.service';
import { PaymentModule } from './modules/payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { deploymentValidationSchema } from './validations/schemas/deployment';
import { AppController } from './app.controller';

@Module({
    imports: [
		ConfigModule.forRoot({
			isGlobal: true, 
			validate: (config) => {
				const result = deploymentValidationSchema.safeParse(config);
				if (!result.success) {
				  throw new Error('Variables de entorno no validas');
				}
				return config;
			},
		}),
    	UsersModule, 
		PaymentModule
    ],
    providers: [PrismaService],
	controllers: [AppController]
})
export class AppModule {}
