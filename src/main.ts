import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors()

	try {
		await app.listen(3000);
	} catch (error) {
		console.log(error)
	}
}
bootstrap();


