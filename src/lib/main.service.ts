import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;
    
    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('HOST'), 
            port: this.configService.get<string>('PORT'),            
            auth: {
                user: this.configService.get<string>('USER'),
                pass: this.configService.get<string>('SENDGRID_API')
            }
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: this.configService.get<string>('EMAIL'),
            to,
            subject,
            text,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            console.error('Error al enviar correo:', error);
        }
    }
}