import { AxiosError } from 'axios';
import { Request, Response, Router } from 'express';

import { Auth, getTokenFromCookie } from '../auth/tokenDings';
import config from '../config';
import { proxyHttpCall } from '../http';
import { axiosLogError } from '../logger';

function dialogRoutes(tokenDings: Auth, dialogApiUrl = config.VEILARBDIALOG_API_URL) {
    const router = Router();
    const DIALOG_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:pto:${config.DIALOG_APP_NAME}`;

    const getTokenXHeaders = async (req: Request) => {
        const idPortenToken = getTokenFromCookie(req);
        const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, DIALOG_CLIENT_ID);
        const token = tokenSet.access_token;
        return { Authorization: null, TokenXAuthorization: `Bearer ${token}` };
    };

    const dialogCall = (url: string) => {
        return async (req: Request, res: Response) => {
            try {
                await proxyHttpCall(url, {
                    headers: await getTokenXHeaders(req),
                })(req, res);
            } catch (err) {
                const axiosError = err as AxiosError;
                const status = axiosError.response?.status || 500;
                axiosLogError(axiosError);
                res.status(status).end();
            }
        };
    };

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
