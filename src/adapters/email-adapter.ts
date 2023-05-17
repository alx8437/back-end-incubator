import nodemailer from 'nodemailer';

export const emailAdapter = {
    async send(email: string, subject: string, htmlMessage: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'stroyka93@gmail.com',
                pass: 'kqzmaocqgctgrewp',
            },
        });

        try {
            let info = await transporter.sendMail({
                from: {
                    name: 'Aleksandr Zelenskii',
                    address: 'stroyka93@gmail.com',
                },
                to: email,
                subject: subject,
                html: htmlMessage,
            });

            return info;
        } catch (e) {
            console.error(e);
        }
    },
};
