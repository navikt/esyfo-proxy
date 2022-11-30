import { Request, Response } from 'express';
import config from './config';
import axios, { AxiosError } from 'axios';
import { axiosLogError } from './logger';
import { getTokenFromCookie } from './auth/tokenDings';

interface ProxyOpts {
    headers?: Record<string, string | null>;
    overrideMethod?: string;
}
export function getDefaultHeaders(req: Request) {
    const token = getTokenFromCookie(req);
    return {
        'Content-Type': req.header('Content-Type') || 'application/json',
        ...(req.header('Nav-Call-Id') ? { 'Nav-Call-Id': req.header('Nav-Call-Id') } : {}),
        ...(req.header('NAV_CSRF_PROTECTION') ? { NAV_CSRF_PROTECTION: req.header('NAV_CSRF_PROTECTION') } : {}),
        [config.CONSUMER_ID_HEADER_NAME]: config.CONSUMER_ID_HEADER_VALUE,
        Authorization: `Bearer ${token}`,
    };
}
export function proxyHttpCall(url: string, opts?: ProxyOpts) {
    return async (req: Request, res: Response) => {
        const token = getTokenFromCookie(req);

        if (!token) {
            return res.status(401).end();
        }
        const method = opts?.overrideMethod || req.method;

        try {
            const { data, status } = await axios(url, {
                method,
                data: req.method === 'POST' ? req.body : undefined,
                params: req.params,
                headers: {
                    ...getDefaultHeaders(req),
                    ...opts?.headers,
                },
                responseType: 'stream',
            });

            if (status === 204) {
                return res.status(status).end();
            }

            return data.pipe(res);
        } catch (err) {
            const axiosError = err as AxiosError;
            const status = axiosError.response?.status || 500;
            axiosLogError(axiosError);
            return res.status(status).send((err as Error).message);
        }
    };
}
