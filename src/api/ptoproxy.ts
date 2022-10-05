import { Router } from 'express';
import config from '../config';
import { proxyHttpCall as proxy } from '../http';

function ptoProxy(ptoProxyUrl = config.PTO_PROXY_URL) {
    const router = Router();
    router.get('/oppfolging', proxy(`${ptoProxyUrl}/veilarboppfolging/api/oppfolging`));
    router.get('/underoppfolging', proxy(`${ptoProxyUrl}/veilarboppfolging/api/niva3/underoppfolging`));
    router.get('/startregistrering', proxy(`${ptoProxyUrl}/veilarbregistrering/api/startregistrering`));
    router.get('/registrering', proxy(`${ptoProxyUrl}/veilarbregistrering/api/registrering`));
    router.get('/standard-innsats', proxy(`${ptoProxyUrl}/veilarbregistrering/api/profilering/standard-innsats`));
    router.get('/dialog/antallUleste', proxy(`${ptoProxyUrl}/veilarbdialog/api/dialog/antallUleste`));
    router.get('/vedtakinfo/besvarelse', proxy(`${ptoProxyUrl}/veilarbvedtakinfo/api/behovsvurdering/besvarelse`));
    router.get('/vedtakinfo/motestotte', proxy(`${ptoProxyUrl}/veilarbvedtakinfo/api/motestotte`));
    router.get(
        '/arbeidssoker/perioder',
        proxy(`${ptoProxyUrl}/veilarbregistrering/api/arbeidssoker/perioder`, { overrideMethod: 'POST' })
    );
    router.get('/gjelderfra', proxy(`${ptoProxyUrl}/veilarbregistrering/api/registrering/gjelderfra`));
    router.post('/gjelderfra', proxy(`${ptoProxyUrl}/veilarbregistrering/api/registrering/gjelderfra`));

    return router;
}

export default ptoProxy;
