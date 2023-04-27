import { Auth, getTokenFromRequest } from '../auth/tokenDings';
import { Request, Router } from 'express';
import config from '../config';
import { proxyTokenXCall } from '../http';

export const getTokenXHeadersForVeilarboppfolging =
    (tokenDings: Auth, naisCluster = config.NAIS_CLUSTER_NAME) =>
    async (req: Request) => {
        const VEILARBOPPFOLGING_CLIENT_ID = `${naisCluster.replace('gcp', 'fss')}:pto:veilarboppfolging`;
        const incomingToken = getTokenFromRequest(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(incomingToken, VEILARBOPPFOLGING_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: `Bearer ${token}` };
    };
function oppfolging(tokenDings: Auth, veilarboppfolgingUrl = config.VEILARBOPPFOLGING_URL) {
    const router = Router();
    const getTokenXHeaders = getTokenXHeadersForVeilarboppfolging(tokenDings);
    /**
     * @openapi
     * /oppfolging:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get(
        '/oppfolging',
        proxyTokenXCall(`${veilarboppfolgingUrl}/veilarboppfolging/api/oppfolging`, getTokenXHeaders)
    );

    /**
     * @openapi
     * /underoppfolging:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get(
        '/underoppfolging',
        proxyTokenXCall(`${veilarboppfolgingUrl}/veilarboppfolging/api/niva3/underoppfolging`, getTokenXHeaders)
    );

    return router;
}

export default oppfolging;
