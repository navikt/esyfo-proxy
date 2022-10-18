import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import log from '../logger';

function profilRoutes(prismaClient: PrismaClient) {
    const router = Router();

    /**
     * @openapi
     * /profil:
     *   get:
     *     description: Henter lagrede profil innstillinger
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/profil', async (req, res) => {
        const token = req.cookies && req.cookies[config.NAV_COOKIE_NAME];
        const decodedToken: any = jwt.decode(token);
        if (decodedToken && decodedToken.pid) {
            const ident = decodedToken.pid;
            log.info(`ident: ${ident}`);
            const profiler = await prismaClient.profil.findMany();
            return res.send(profiler);
        }
        log.error('fikk ikke hentet ident fra token');
        return res.sendStatus(401);
    });

    /**
     * @openapi
     * /profil:
     *   post:
     *     description: Lagrer profil innstillinger
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.post('/profil', async (_, res) => {
        res.send('Save');
    });

    return router;
}

export default profilRoutes;
