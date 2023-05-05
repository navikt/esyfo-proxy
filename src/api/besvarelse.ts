import { Request, Router } from 'express';
import config from '../config';
import { Auth, getTokenFromRequest } from '../auth/tokenDings';
import { proxyTokenXCall } from '../http';
import logger, { getCustomLogProps } from '../logger';

function besvarelse(tokenDings: Auth, besvarelseUrl = config.BESVARELSE_URL): Router {
    const router = Router();
    const BESVARELSE_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:paw:paw-arbeidssoker-besvarelse`;

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = getTokenFromRequest(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, BESVARELSE_CLIENT_ID);
        const token = tokenSet.access_token;
        logger.info(getCustomLogProps(req), `besvarelse token: ${token}`);
        return { Authorization: `Bearer ${token}` };
    };

    router.get('/besvarelse', proxyTokenXCall(`${besvarelseUrl}/api/v1/besvarelse`, getTokenXHeaders));
    router.post('/besvarelse', proxyTokenXCall(`${besvarelseUrl}/api/v1/besvarelse/situasjon`, getTokenXHeaders));

    return router;
}

export default besvarelse;
