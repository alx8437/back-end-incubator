import { emailManager } from '../managers/email-manager';

export const businessService = {
    async createNewRegistration(
        email: string,
        login: string,
        password: string,
    ) {
        // create a new user
        // save hash for password

        try {
            const result = await emailManager.sendRegisterVerifyCode(email);
            console.log(result);
        } catch (e) {
            console.error(e);
        }
    },
};
