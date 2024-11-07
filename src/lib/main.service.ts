import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.HOST, 
            port: process.env.PORT,            
            auth: {
                user: process.env.USER,
                pass: process.env.SENDGRID_API
            }
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: process.env.EMAIL,
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