import { getAuthCode } from '../utils/authorization';
import { emailAdapter } from '../adapters/email-adapter';

export const emailManager = {
    async sendRegisterVerifyCode(email: string) {
        const authCode = getAuthCode();
        const subject = 'Verification code from IT-INCUBATOR samurai';
        const htmlMessage = `<b>Your verification code is ${authCode}</b>`;
        const result = await emailAdapter.send(email, subject, htmlMessage);

        return result;
    },
};
