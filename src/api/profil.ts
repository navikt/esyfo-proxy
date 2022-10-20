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

        try {
            const profil = await profilRepository.hentProfil(ident as string);

            if (!profil) {
                return res.sendStatus(204);
            }

            return res.send(profil);
        } catch (err) {
            return res.status(500).send((err as Error)?.message);
        }
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
    router.post('/profil', async (req, res) => {
        const ident = getPidFromToken(req) as string;
        if (!ident) {
            log.error('fikk ikke hentet ident fra token');
            return res.sendStatus(401);
        }

        const profil = req.body;

        if (!profil) {
            return res.status(400).end();
        }

        try {
            await profilRepository.lagreProfil({
                bruker: ident,
                profil,
            });
            return res.status(201).send(profil);
        } catch (err) {
            return res.status(500).send(`${(err as Error).message}`);
        }
    });

    return router;
}

export default profilRoutes;
