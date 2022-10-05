import { Router } from 'express';
import config from '../config';
import { Auth } from '../tokenx/dagpengerTokenDings';
import { proxyHttpCall } from '../http';

// const VEDTAK_URL = `${DAGPENGER_INNSYN_URL}/vedtak`;
// const PABEGYNTE_SOKNADER_URL = `${DAGPENGER_INNSYN_URL}/paabegynte`;

function dagpengerRoutes(createDagpengerTokenDings: Auth, dagpengerInnsynUrl = config.DAGPENGER_INNSYN_URL) {
    const SOKNAD_URL = `${dagpengerInnsynUrl}/soknad`;
    const router = Router();

    router.get('/dagpenger/soknad', async (req, res) => {
        try {
            const idPortenToken = req.cookies[config.NAV_COOKIE_NAME];
            const tokenSet = await createDagpengerTokenDings.exchangeIDPortenToken(idPortenToken);
            const token = tokenSet.access_token;
            await proxyHttpCall(SOKNAD_URL, {
                headers: { Authorization: `Bearer ${token}`, TokenXAuthorization: `Bearer ${token}` },
            })(req, res);
        } catch (err) {
            res.status(500).end();
        }
    });

    return router;
}

export default dagpengerRoutes;
