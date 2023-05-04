import { Request, Router } from 'express';

import { Auth, getTokenFromRequest } from '../auth/tokenDings';
import config from '../config';
import { proxyTokenXCall } from '../http';

function meldekortRoutes(tokenDings: Auth, meldekortUrl: string = config.MELDEKORT_URL) {
    const router = Router();
    const MELDEKORT_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:meldekort:${config.MELDEKORT_APP_NAME}`;

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = getTokenFromRequest(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, MELDEKORT_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: null, TokenXAuthorization: `Bearer ${token}` };
    };

    const meldekortCall = (url: string) => proxyTokenXCall(url, getTokenXHeaders);

    /**
     * @openapi
     * /meldekort:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Person'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/meldekort', meldekortCall(`${meldekortUrl}/meldekort`));

    /**
     * @openapi
     * /meldekort/status:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PersonStatus'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/meldekort/status', meldekortCall(`${meldekortUrl}/meldekortstatus`));

    return router;
}

export default meldekortRoutes;
