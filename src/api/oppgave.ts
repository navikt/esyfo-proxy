import { Router } from 'express';
import logger from '../logger';

function oppgaveRoutes(scope: string) {
    const router = Router();

    router.post('/oppgave', async (req, res) => {
        try {
            // const fnr = (req as ValidatedRequest).user.fnr;
            // const azureAdToken = await getAzureAdToken(scope);
            logger.debug(scope);
            // TODO
            res.status(204).end();
        } catch (e) {
            logger.error(e, `Feil ved posting av ny oppgave`);
            res.status(500).end();
        }
    });

    return router;
}

export default oppgaveRoutes;
