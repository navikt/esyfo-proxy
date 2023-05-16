import { Router } from 'express';
import { getTokenFromHeader } from '../../auth/tokenDings';
import { VerifyJwt } from '../../auth/azure';
import config from '../../config';

function veilederApi(
    verifyAzureToken: (bearerToken: string) => Promise<VerifyJwt>,
    azureAppIdClient = config.AZURE_APP_CLIENT_ID
) {
    const router = Router();

    router.post('/veileder/besvarelse', async (req, res) => {
        const bearerToken = getTokenFromHeader(req);
        if (!bearerToken) {
            res.status(401).send('mangler bearer token');
            return;
        }

        try {
            const result = await verifyAzureToken(bearerToken);
            if ('errorType' in result || result.payload.aud !== azureAppIdClient) {
                res.status(401).send('feil ved verifisering av token');
                return;
            }
            const { fnr } = req.body;

            if (!fnr) {
                res.status(400).end();
                return;
            }

            // sjekk at veileder har lov til å hente ut data

            // proxy kall til besvarelse - med hvilket token?
            res.status(200).end();
        } catch (err) {
            res.status(401).send('kan ikke verifisere token');
            return;
        }
    });
    return router;
}

export default veilederApi;
