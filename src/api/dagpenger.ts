import { Request, Response, Router } from 'express';
import config from '../config';
import { Auth } from '../tokenx/tokenDings';
import { proxyHttpCall } from '../http';
import logger from '../logger';

function dagpengerRoutes(tokenDings: Auth, dagpengerInnsynUrl = config.DAGPENGER_INNSYN_URL) {
    const SOKNAD_URL = `${dagpengerInnsynUrl}/soknad`;
    const VEDTAK_URL = `${dagpengerInnsynUrl}/vedtak`;
    const PABEGYNTE_SOKNADER_URL = `${dagpengerInnsynUrl}/paabegynte`;
    const DP_INNSYN_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:teamdagpenger:dp-innsyn`;

    const router = Router();

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = req.cookies[config.NAV_COOKIE_NAME];
        const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, DP_INNSYN_CLIENT_ID);
        const token = tokenSet.access_token;
        // TODO: Skal fjernes
        logger.info(`TOKEN: ${token}`);
        return { Authorization: `Bearer ${token}`, TokenXAuthorization: `Bearer ${token}` };
    };

    const dagpengerCall = (url: string) => {
        return async (req: Request, res: Response) => {
            try {
                await proxyHttpCall(url, {
                    headers: await getTokenXHeaders(req),
                })(req, res);
            } catch (err) {
                logger.error(`Feil med dagpenger kall: ${(err as Error).message}`);
                res.status(500).end();
            }
        };
    };
    /**
     * @openapi
     * /dagpenger/soknad:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/dagpenger/soknad', dagpengerCall(SOKNAD_URL));
    /**
     * @openapi
     * /dagpenger/vedtak:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/dagpenger/vedtak', dagpengerCall(VEDTAK_URL));
    /**
     * @openapi
     * /dagpenger/paabegynte:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/dagpenger/paabegynte', dagpengerCall(PABEGYNTE_SOKNADER_URL));

    return router;
}

export default dagpengerRoutes;
