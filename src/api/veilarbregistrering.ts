import { proxyHttpCall as proxy } from '../http';
import config from '../config';
import { Router } from 'express';

function veilarbregistrering(
    veilarbregistreringUrl = config.VEILARBREGISTRERING_URL,
    veilarbregistreringGcpUrl = config.VEILARBREGISTRERING_GCP_URL
): Router {
    const router = Router();

    /**
     * @openapi
     * /startregistrering:
     *   get:
     *     description: Henter oppfølgingsinformasjon om arbeidssøker.
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StartRegistreringStatusDto'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/startregistrering', proxy(`${veilarbregistreringGcpUrl}/veilarbregistrering/api/startregistrering`));

    /**
     * @openapi
     * /registrering:
     *   get:
     *     description: Henter siste registrering av bruker.
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/brukerregistreringwrapper'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/registrering', proxy(`${veilarbregistreringUrl}/veilarbregistrering/api/registrering`));

    /**
     * @openapi
     * /standard-innsats:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
     *               type: boolean
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
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
     *       - in: query
     *         name: tilOgMed
     *         required: false
     *         format: date
     *         type: string
     *         description: Dato YYYY-MM-DD
     *     description: Henter alle perioder hvor bruker er registrert som arbeidssøker.
     *     responses:
     *       200:
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ArbeidssokerperioderDto'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get(
        '/arbeidssoker/perioder',
        proxy(`${veilarbregistreringGcpUrl}/veilarbregistrering/api/arbeidssoker/perioder`, { overrideMethod: 'POST' })
    );

    /**
     * @openapi
     * /meldekort/siste:
     *   get:
     *     description: Henter siste meldekort for bruker.
     *     responses:
     *       200:
     *         content:
     *         application/json:
     *             schema:
     *               $ref: '#/components/schemas/MeldekortDto'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/meldekort/siste', proxy(`${veilarbregistreringGcpUrl}/veilarbregistrering/api/meldekort/siste`));
    /**
     * @openapi
     * /meldekort:
     *   get:
     *     description: Henter meldekortliste for bruker.
     *     responses:
     *       200:
     *         content:
     *          application/json:
     *             schema:
     *               $ref: '#/components/schemas/MeldekortDtoListe'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/meldekort', proxy(`${veilarbregistreringGcpUrl}/veilarbregistrering/api/meldekort`));
    return router;
}

export default veilarbregistrering;
