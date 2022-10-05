import axios, { AxiosError } from 'axios';
import { Request, Response, Router } from 'express';
import config from '../config';

function ptoProxyCall(url: string, overrideMethod?: string) {
    return async (req: Request, res: Response) => {
        const token = req.cookies[config.NAV_COOKIE_NAME];
        try {
            const { data } = await axios(url, {
                method: overrideMethod || req.method,
                data: req.method === 'POST' ? req.body : undefined,
                params: req.params,
                headers: {
                    'Content-Type': req.headers['content-type'] || 'application/json',
                    Authorization: `Bearer ${token}`,
                    [config.CONSUMER_ID_HEADER_NAME]: config.CONSUMER_ID_HEADER_VALUE,
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

function ptoProxy() {
    const router = Router();
    router.get('/oppfolging', ptoProxyCall(`${config.PTO_PROXY_URL}/veilarboppfolging/api/oppfolging`));
    router.get('/underoppfolging', ptoProxyCall(`${config.PTO_PROXY_URL}/veilarboppfolging/api/niva3/underoppfolging`));
    router.get('/startregistrering', ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbregistrering/api/startregistrering`));
    router.get('/registrering', ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbregistrering/api/registrering`));
    router.get(
        '/standard-innsats',
        ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbregistrering/api/profilering/standard-innsats`)
    );
    router.get('/dialog/antallUleste', ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbdialog/api/dialog/antallUleste`));
    router.get(
        '/vedtakinfo/besvarelse',
        ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbvedtakinfo/api/behovsvurdering/besvarelse`)
    );
    router.get('/vedtakinfo/motestotte', ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbvedtakinfo/api/motestotte`));
    router.get(
        '/arbeidssoker/perioder',
        ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbregistrering/api/arbeidssoker/perioder`, 'POST')
    );
    router.get('/gjelderfra', ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbregistrering/api/registrering/gjelderfra`));
    router.post('/gjelderfra', ptoProxyCall(`${config.PTO_PROXY_URL}/veilarbregistrering/api/registrering/gjelderfra`));

    return router;
}

export default ptoProxy;
