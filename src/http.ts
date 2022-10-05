import { Request, Response } from 'express';
import config from './config';
import axios, { AxiosError } from 'axios';

interface ProxyOpts {
    headers?: Record<string, string>;
    overrideMethod?: string;
}

export function proxyHttpCall(url: string, opts?: ProxyOpts) {
    return async (req: Request, res: Response) => {
        const token = req.cookies[config.NAV_COOKIE_NAME];
        try {
            const { data } = await axios(url, {
                method: opts?.overrideMethod || req.method,
                data: req.method === 'POST' ? req.body : undefined,
                params: req.params,
                headers: {
                    'Content-Type': req.headers['content-type'] || 'application/json',
                    Authorization: `Bearer ${token}`,
                    [config.CONSUMER_ID_HEADER_NAME]: config.CONSUMER_ID_HEADER_VALUE,
                    ...opts?.headers,
                },
                responseType: 'stream',
            });
            data.pipe(res);
        } catch (err) {
            console.error(err);
            const status = (err as AxiosError).response?.status || 500;
            res.status(status).send((err as Error).message);
        }
    };
}
