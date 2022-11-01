import { Router } from 'express';
import config from '../config';
import { proxyHttpCall as proxy } from '../http';

function ptoProxy(ptoProxyUrl = config.PTO_PROXY_URL) {
    const router = Router();
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
    router.get('/oppfolging', proxy(`${ptoProxyUrl}/veilarboppfolging/api/oppfolging`));
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
    router.get('/underoppfolging', proxy(`${ptoProxyUrl}/veilarboppfolging/api/niva3/underoppfolging`));
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
    router.get('/dialog/antallUleste', proxy(`${ptoProxyUrl}/veilarbdialog/api/dialog/antallUleste`));
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
    router.post('/dialog', proxy(`${ptoProxyUrl}/veilarbdialog/api/dialog`));
    /**
     * @openapi
     * /vedtakinfo/besvarelse:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         $ref: '#/components/schemas/Ok'
     *       401:
     *         $ref: '#/components/schemas/Unauthorized'
     */
    router.get('/vedtakinfo/besvarelse', proxy(`${ptoProxyUrl}/veilarbvedtakinfo/api/behovsvurdering/besvarelse`));
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
    router.get('/vedtakinfo/motestotte', proxy(`${ptoProxyUrl}/veilarbvedtakinfo/api/motestotte`));

    return router;
}

export default ptoProxy;
