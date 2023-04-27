import { Auth, getTokenFromRequest } from '../auth/tokenDings';
import config from '../config';
import { Request, Router } from 'express';
import { proxyTokenXCall } from '../http';

function vedtakinfo(tokenDings: Auth, veilarbvedtakinfoUrl = config.VEILARBVEDTAKINFO_URL) {
    const router = Router();
    const VEILARBVEDTAKINFO_CLIENT_ID = `${config.NAIS_CLUSTER_NAME.replace('gcp', 'fss')}:pto:veilarbvedtakinfo`;

    const getTokenXHeaders = async (req: Request) => {
        const incomingToken = getTokenFromRequest(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(incomingToken, VEILARBVEDTAKINFO_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: `Bearer ${token}` };
    };

    /**
     * @openapi
     * /vedtakinfo/motestotte:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get(
        '/vedtakinfo/motestotte',
        proxyTokenXCall(`${veilarbvedtakinfoUrl}/veilarbvedtakinfo/api/motestotte`, getTokenXHeaders)
    );

    return router;
}

export default vedtakinfo;
