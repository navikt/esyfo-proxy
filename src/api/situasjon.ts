import { Request, Router } from 'express';
import config from '../config';
import { Auth, getTokenFromRequest } from '../auth/tokenDings';
import { proxyTokenXCall } from '../http';

function situasjon(tokenDings: Auth, situasjonUrl = config.SITUASJON_URL): Router {
    const router = Router();
    const SITUASJON_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:paw:${config.SITUASJON_APP_NAME}`;

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = getTokenFromRequest(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, SITUASJON_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: `Bearer ${token}` };
    };

    router.get('/situasjon', proxyTokenXCall(`${situasjonUrl}/api/v1/situasjon`, getTokenXHeaders));
    router.post('/situasjon', proxyTokenXCall(`${situasjonUrl}/api/v1/situasjon`, getTokenXHeaders));

    return router;
}

export default situasjon;
