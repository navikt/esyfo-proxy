import { Request, Response, Router } from 'express';
import config from '../config';
import { Auth } from '../tokenx/dagpengerTokenDings';
import { proxyHttpCall } from '../http';

function dagpengerRoutes(createDagpengerTokenDings: Auth, dagpengerInnsynUrl = config.DAGPENGER_INNSYN_URL) {
    const SOKNAD_URL = `${dagpengerInnsynUrl}/soknad`;
    const VEDTAK_URL = `${dagpengerInnsynUrl}/vedtak`;
    const PABEGYNTE_SOKNADER_URL = `${dagpengerInnsynUrl}/paabegynte`;

    const router = Router();

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = req.cookies[config.NAV_COOKIE_NAME];
        const tokenSet = await createDagpengerTokenDings.exchangeIDPortenToken(idPortenToken);
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
                res.status(500).end();
            }
        };
    };
    /**
     * @openapi
     * /dagpenger/soknad:
     *   get:
     *     description: Welcome to swagger-jsdoc!
     *     responses:
     *       200:
     *         description: Returns a mysterious string.
     */
    router.get('/dagpenger/soknad', dagpengerCall(SOKNAD_URL));
    router.get('/dagpenger/vedtak', dagpengerCall(VEDTAK_URL));
    router.get('/dagpenger/paabegynte', dagpengerCall(PABEGYNTE_SOKNADER_URL));

    return router;
}

export default dagpengerRoutes;
