import { Request, Response, Router } from 'express';
import config from '../config';
import { Auth, getTokenFromCookie } from '../auth/tokenDings';
import { proxyHttpCall } from '../http';
import logger from '../logger';

function dagpengerRoutes(tokenDings: Auth, dagpengerInnsynUrl = config.DAGPENGER_INNSYN_URL) {
    const SOKNAD_URL = `${dagpengerInnsynUrl}/soknad`;
    const VEDTAK_URL = `${dagpengerInnsynUrl}/vedtak`;
    const PABEGYNTE_SOKNADER_URL = `${dagpengerInnsynUrl}/paabegynte`;
    const DP_INNSYN_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:teamdagpenger:dp-innsyn`;

    const router = Router();

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = getTokenFromCookie(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, DP_INNSYN_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: `Bearer ${token}`, TokenXAuthorization: `Bearer ${token}` };
    };

    const dagpengerCall = (url: string) => {
        return async (req: Request, res: Response) => {
            try {
                await proxyHttpCall(url, {
                    headers: await getTokenXHeaders(req),
                })(req, res);
            } catch (err) {
                logger.error(`Feil med dagpenger kall: ${err}`);
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
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/dagpenger/soknad', dagpengerCall(SOKNAD_URL));
    /**
     * @openapi
     * /dagpenger/vedtak:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/dagpenger/vedtak', dagpengerCall(VEDTAK_URL));
    /**
     * @openapi
     * /dagpenger/paabegynte:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/dagpenger/paabegynte', dagpengerCall(PABEGYNTE_SOKNADER_URL));

    return router;
}

export default dagpengerRoutes;
