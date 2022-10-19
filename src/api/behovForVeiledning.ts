import { Router } from 'express';
import log from '../logger';
import { getPidFromToken } from '../auth/tokenDings';
import { BehovRepository } from '../db/behovForVeiledningRepository';

function behovForVeiledningRoutes(behovForVeiledningRepository: BehovRepository) {
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
    router.get('/behov-for-veiledning', async (req, res) => {
        const ident = getPidFromToken(req);
        if (!ident) {
            log.error('fikk ikke hentet ident fra token');
            return res.sendStatus(401);
        }

        const behov = await behovForVeiledningRepository.hentBehov(ident as string);
        return res.send(behov);
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
    router.post('/behov-for-veiledning', async (req, res) => {
        const ident = getPidFromToken(req) as string;
        if (!ident) {
            log.error('fikk ikke hentet ident fra token');
            return res.sendStatus(401);
        }

        const oppfolging = req.body?.oppfolging;

        if (!oppfolging) {
            return res.status(400).end();
        }

        try {
            await behovForVeiledningRepository.lagreBehov({
                bruker: ident,
                oppfolging: oppfolging,
            });
            return res.status(201).send({ oppfolging });
        } catch (err) {
            return res.status(500).send(`${(err as Error).message}`);
        }
    });

    return router;
}

export default behovForVeiledningRoutes;
