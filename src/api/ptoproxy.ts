import { Router } from 'express';
import config from '../config';
import { proxyHttpCall as proxy } from '../http';

function ptoProxy() {
    const router = Router();
    router.get('/oppfolging', proxy(`${config.PTO_PROXY_URL}/veilarboppfolging/api/oppfolging`));
    router.get('/underoppfolging', proxy(`${config.PTO_PROXY_URL}/veilarboppfolging/api/niva3/underoppfolging`));
    router.get('/startregistrering', proxy(`${config.PTO_PROXY_URL}/veilarbregistrering/api/startregistrering`));
    router.get('/registrering', proxy(`${config.PTO_PROXY_URL}/veilarbregistrering/api/registrering`));
    router.get(
        '/standard-innsats',
        proxy(`${config.PTO_PROXY_URL}/veilarbregistrering/api/profilering/standard-innsats`)
    );
    router.get('/dialog/antallUleste', proxy(`${config.PTO_PROXY_URL}/veilarbdialog/api/dialog/antallUleste`));
    router.get(
        '/vedtakinfo/besvarelse',
        proxy(`${config.PTO_PROXY_URL}/veilarbvedtakinfo/api/behovsvurdering/besvarelse`)
    );
    router.get('/vedtakinfo/motestotte', proxy(`${config.PTO_PROXY_URL}/veilarbvedtakinfo/api/motestotte`));
    router.get(
        '/arbeidssoker/perioder',
        proxy(`${config.PTO_PROXY_URL}/veilarbregistrering/api/arbeidssoker/perioder`, { overrideMethod: 'POST' })
    );
    router.get('/gjelderfra', proxy(`${config.PTO_PROXY_URL}/veilarbregistrering/api/registrering/gjelderfra`));
    router.post('/gjelderfra', proxy(`${config.PTO_PROXY_URL}/veilarbregistrering/api/registrering/gjelderfra`));

    return router;
}

export default ptoProxy;
