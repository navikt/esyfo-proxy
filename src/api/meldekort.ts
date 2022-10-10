import { Auth } from '../tokenx/tokenDings';
import config from '../config';
import { Request, Response, Router } from 'express';
import { proxyHttpCall } from '../http';

function meldekortRoutes(tokenDings: Auth, meldekortUrl: string = config.MELDEKORT_URL) {
    const router = Router();
    const MELDEKORT_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:meldekort:${config.MELDEKORT_APP_NAME}`;

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = req.cookies[config.NAV_COOKIE_NAME];
        const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, MELDEKORT_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: null, TokenXAuthorization: `Bearer ${token}` };
    };

    const meldekortCall = (url: string) => {
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

    router.get('/meldekort', meldekortCall(`${meldekortUrl}/meldekort`));
    router.get('/meldekort/status', meldekortCall(`${meldekortUrl}/meldekortstatus`));

    return router;
}

export default meldekortRoutes;
