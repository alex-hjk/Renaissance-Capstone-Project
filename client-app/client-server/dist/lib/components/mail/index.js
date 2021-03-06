"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
async function main() {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: '',
            pass: ''
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const info = await transporter.sendMail({
        from: '"Collin Lim 👻" <gmail>',
        to: '',
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>'
    });
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
}
main().catch(console.error);
