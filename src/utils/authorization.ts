import { IncomingHttpHeaders } from 'http2';
import { Response } from 'express';

export const checkAuthorization = (
    res: Response,
    header: IncomingHttpHeaders,
) => {
    const basicAuthorisationData = 'Basic YWRtaW46cXdlcnR5';
    const { authorization } = header;

    const isAuthorize =
        !!authorization && authorization === basicAuthorisationData;

    if (!isAuthorize) {
        res.send(401);
    }

    return;
};
