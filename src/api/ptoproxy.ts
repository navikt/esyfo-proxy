import { Router } from 'express';
import config from '../config';
import { proxyHttpCall as proxy } from '../http';

function ptoProxy(ptoProxyUrl = config.PTO_PROXY_URL) {
    const router = Router();
    /**
     * @openapi
     * /oppfolging:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/oppfolging', proxy(`${ptoProxyUrl}/veilarboppfolging/api/oppfolging`));
    /**
     * @openapi
     * /underoppfolging:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/underoppfolging', proxy(`${ptoProxyUrl}/veilarboppfolging/api/niva3/underoppfolging`));
    /**
     * @openapi
     * /startregistrering:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/startregistrering', proxy(`${ptoProxyUrl}/veilarbregistrering/api/startregistrering`));
    /**
     * @openapi
     * /registrering:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/registrering', proxy(`${ptoProxyUrl}/veilarbregistrering/api/registrering`));
    /**
     * @openapi
     * /standard-innsats:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/standard-innsats', proxy(`${ptoProxyUrl}/veilarbregistrering/api/profilering/standard-innsats`));
    /**
     * @openapi
     * /dialog/antallUleste:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/dialog/antallUleste', proxy(`${ptoProxyUrl}/veilarbdialog/api/dialog/antallUleste`));
    /**
     * @openapi
     * /vedtakinfo/besvarelse:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/vedtakinfo/besvarelse', proxy(`${ptoProxyUrl}/veilarbvedtakinfo/api/behovsvurdering/besvarelse`));
    /**
     * @openapi
     * /vedtakinfo/motestotte:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/vedtakinfo/motestotte', proxy(`${ptoProxyUrl}/veilarbvedtakinfo/api/motestotte`));
    /**
     * @openapi
     * /arbeidssoker/perioder:
     *   get:
     *     parameters:
     *       - in: query
     *         name: fraOgMed
     *         required: true
     *         format: date
     *         type: string
     *         description: Dato YYYY-MM-DD
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get(
        '/arbeidssoker/perioder',
        proxy(`${ptoProxyUrl}/veilarbregistrering/api/arbeidssoker/perioder`, { overrideMethod: 'POST' })
    );
    /**
     * @openapi
     * /gjelderfra:
     *   post:
     *     parameters:
     *       - in: body
     *         name: dato
     *         required: true
     *         format: date
     *         type: string
     *         description: Dato YYYY-MM-DD
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/gjelderfra', proxy(`${ptoProxyUrl}/veilarbregistrering/api/registrering/gjelderfra`));
    router.post('/gjelderfra', proxy(`${ptoProxyUrl}/veilarbregistrering/api/registrering/gjelderfra`));

    return router;
}

export default ptoProxy;
