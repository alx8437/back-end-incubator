import { IncomingHttpHeaders } from 'http2';

export const checkBasicAuthorization = (
    header: IncomingHttpHeaders,
): boolean => {
    const basicAuthorisationData = 'Basic YWRtaW46cXdlcnR5';
    const { authorization } = header;

    return !!authorization && authorization === basicAuthorisationData;
};
