import { Router } from 'express';
import logger from '../../logger';
import { validateAzureToken } from '../../auth/azure';

function automatiskReaktiveringRoutes() {
    const router = Router();

    router.get('/m2m/automatisk-reaktivering', async (req, res) => {
        // 1. autentiser
        // 2. lagre i basen
        // 3. returner 201 Created
        const bearerToken = req.header('Authorization');
        if (bearerToken) {
            const validationResult = await validateAzureToken(bearerToken);
            if (validationResult !== 'valid') {
                logger.error(`Feil ved validering ${validationResult}`);
                res.status(401).end();
                return;
            }
        }
        res.status(200).end();
    });

    return router;
}

export default automatiskReaktiveringRoutes;
