import { IncomingHttpHeaders } from 'http2';

export const checkAuthorization = (
    header: IncomingHttpHeaders,
): boolean => {
    const basicAuthorisationData = 'Basic YWRtaW46cXdlcnR5';
    const { authorization } = header;

    return !!authorization && authorization === basicAuthorisationData;

};
