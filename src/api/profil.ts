import { Router } from 'express';
import log from '../logger';
import { getPidFromToken } from '../auth/tokenDings';
import { ProfilRepository } from '../db/profilRepository';

function profilRoutes(profilRepository: ProfilRepository) {
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
        const ident = getPidFromToken(req);
        if (!ident) {
            log.error('fikk ikke hentet ident fra token');
            return res.sendStatus(401);
        }

        const profil = await profilRepository.hentProfil(ident as string);
        return res.send(profil);
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
