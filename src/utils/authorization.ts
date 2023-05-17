import { IncomingHttpHeaders } from 'http2';

export const checkBasicAuthorization = (
    header: IncomingHttpHeaders,
): boolean => {
    const basicAuthorisationData = 'Basic YWRtaW46cXdlcnR5';
    const { authorization } = header;

    return !!authorization && authorization === basicAuthorisationData;
};

export const getAuthCode = (length: number = 8) => {
    const randomNumber = Math.floor(Math.random() * 100000000);
    return randomNumber.toString().padStart(length, '0');
};
