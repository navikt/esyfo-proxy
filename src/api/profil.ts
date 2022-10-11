import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

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
    router.get('/profil', async (_, res) => {
        const profiler = await prismaClient.profil.findMany();
        res.send(profiler);
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
