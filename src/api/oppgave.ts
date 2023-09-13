import { Router } from 'express';
import logger, { axiosLogError } from '../logger';
import { getAzureAdToken } from '../auth/azure';
import { ValidatedRequest } from '../middleware/token-validation';
import config from '../config';
import { ulid } from 'ulid';
import axios, { AxiosError } from 'axios';

export const createOppgaveRoutes = (getAzureAdToken: (scope: string) => Promise<string>) => {
    return (scope: string, oppgaveUrl = config.OPPGAVE_URL) => {
        const router = Router();

        router.post('/oppgave', async (req, res) => {
            try {
                const fnr = (req as ValidatedRequest).user.fnr;
                const azureAdToken = await getAzureAdToken(scope);
                const { beskrivelse } = req.body;
                const payload = {
                    personident: fnr,
                    beskrivelse,
                    tema: 'DAG',
                    oppgavetype: 'VUR_KONS_YTE',
                    aktivDato: new Date().toLocaleDateString('en-GB').replaceAll('/', '.'), // <dd.mm.yyyy>,
                    prioritet: 'HOY',
                };

                await axios(`${oppgaveUrl}/api/v1/oppgaver`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Correlation-ID': ulid(),
                        [config.CONSUMER_ID_HEADER_NAME]: config.CONSUMER_ID_HEADER_VALUE,
                        Authorization: `Bearer ${azureAdToken}`,
                    },
                    data: payload,
                });

                res.status(201).end();
            } catch (e: any) {
                logger.error(e, `Feil ved posting av ny oppgave`);
                const axiosError = e as AxiosError;
                const status = axiosError.response?.status || 500;
                axiosLogError(axiosError);
                res.status(status).end();
            }
        });

        return router;
    };
};

const oppgaveRoutes = createOppgaveRoutes(getAzureAdToken);
export default oppgaveRoutes;
