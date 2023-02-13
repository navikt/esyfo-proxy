import { Router } from 'express';

import config from '../config';
import { proxyHttpCall } from '../http';

function dialog(dialogApiUrl = config.VEILARBDIALOG_API_URL) {
    const router = Router();

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
    router.get('/dialog/antallUleste', proxyHttpCall(`${dialogApiUrl}/dialog/antallUleste`));

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
    router.post('/dialog', proxyHttpCall(`${dialogApiUrl}/dialog`));

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
    router.post('/dialog/egenvurdering', proxyHttpCall(`${dialogApiUrl}/dialog/egenvurdering`));

    return router;
}

export default dialog;
