import { Request, Router } from 'express';

import { Auth, getTokenFromCookie } from '../auth/tokenDings';
import config from '../config';
import { proxyTokenXCall } from '../http';

function dialogRoutes(tokenDings: Auth, dialogApiUrl = config.VEILARBDIALOG_API_URL) {
    const router = Router();
    const DIALOG_CLIENT_ID = `${config.NAIS_CLUSTER_NAME.replace('gcp', 'fss')}:pto:${config.DIALOG_APP_NAME}`;

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = getTokenFromCookie(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, DIALOG_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: `Bearer ${token}` };
    };

    const dialogCall = (url: string) => proxyTokenXCall(url, getTokenXHeaders);
    /**
     * @openapi
     * /dialog/antallUleste:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/dialog/antallUleste', dialogCall(`${dialogApiUrl}/dialog/antallUleste`));

    /**
     * @openapi
     * /dialog:
     *   post:
     *     description: Oppretter ny dialog i dialogløsningen
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.post('/dialog', dialogCall(`${dialogApiUrl}/dialog`));

    /**
     * @openapi
     * /dialog/egenvurdering:
     *   post:
     *     description: Oppretter ny dialog i dialogløsningen og setter den til ferdig behandlet
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.post('/dialog/egenvurdering', dialogCall(`${dialogApiUrl}/dialog/egenvurdering`));

    return router;
}

export default dialogRoutes;
