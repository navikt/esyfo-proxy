import { proxyHttpCall as proxy } from '../http';
import config from '../config';
import { Router } from 'express';

function veilarbregistrering(veilarbregistreringUrl = config.VEILARBREGISTRERING_URL): Router {
    const router = Router();

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
    router.get('/startregistrering', proxy(`${veilarbregistreringUrl}/veilarbregistrering/api/startregistrering`));
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
    router.get('/registrering', proxy(`${veilarbregistreringUrl}/veilarbregistrering/api/registrering`));
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
    router.get(
        '/standard-innsats',
        proxy(`${veilarbregistreringUrl}/veilarbregistrering/api/profilering/standard-innsats`)
    );
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
        proxy(`${veilarbregistreringUrl}/veilarbregistrering/api/arbeidssoker/perioder`, { overrideMethod: 'POST' })
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
    router.get('/gjelderfra', proxy(`${veilarbregistreringUrl}/veilarbregistrering/api/registrering/gjelderfra`));
    router.post('/gjelderfra', proxy(`${veilarbregistreringUrl}/veilarbregistrering/api/registrering/gjelderfra`));

    return router;
}

export default veilarbregistrering;
