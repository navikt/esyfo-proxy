import { Router } from 'express';
import { getTokenFromCookie } from '../../../auth/tokenDings';
import axios from 'axios';
import config from '../../../config';
import logger from '../../../logger';
import { MeldekortDto } from './typer';
import { beregnMeldekortStatus, grupperMeldekort } from './beregnMeldekortStatus';

function meldekortInaktivering(veilarbregistreringGcpUrl = config.VEILARBREGISTRERING_GCP_URL) {
    const router = Router();

    router.get('/data/meldekort-inaktivering', async (req, res) => {
        const token = getTokenFromCookie(req);

        if (!token) {
            return res.status(401).end();
        }

        try {
            const meldekort: MeldekortDto[] = await axios(
                `${veilarbregistreringGcpUrl}/veilarbregistrering/api/arbeidssoker/meldekort`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        [config.CONSUMER_ID_HEADER_NAME]: config.CONSUMER_ID_HEADER_VALUE,
                    },
                }
            );

            const grupperteMeldekort = grupperMeldekort(meldekort);
            const meldekortStatus = beregnMeldekortStatus(grupperteMeldekort);

            return res.status(200).send({ meldekortStatus });
        } catch (err) {
            logger.error(`Feil i /meldekort-inaktivering: ${err}`);
            return res.status(500).end();
        }
    });

    return router;
}

export default meldekortInaktivering;
