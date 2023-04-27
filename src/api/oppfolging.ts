import { Auth, getTokenFromRequest } from '../auth/tokenDings';
import { Request, Router } from 'express';
import config from '../config';
import { proxyTokenXCall } from '../http';

function oppfolging(tokenDings: Auth, veilarboppfolgingUrl = config.VEILARBOPPFOLGING_URL) {
    const router = Router();
    const VEILARBOPPFOLGING_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:pto:veilarboppfolging`;

    const getTokenXHeaders = async (req: Request) => {
        const incomingToken = getTokenFromRequest(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(incomingToken, VEILARBOPPFOLGING_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: `Bearer ${token}` };
    };

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
