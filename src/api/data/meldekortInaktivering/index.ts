import { Router } from 'express';
import { getTokenFromCookie } from '../../../auth/tokenDings';
import axios from 'axios';
import config from '../../../config';
import logger from '../../../logger';
import { MeldekortDto } from './typer';

const sorterEtterNyestePeriodeFra = (a: MeldekortDto, b: MeldekortDto) => {
    return new Date(b.periodeFra).getTime() - new Date(b.periodeFra).getTime();
};

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

            /* TODO:
          1. sortere på periodeFra
          2. filtrer ut alle hendelser eldre enn 8 uker
          3. Gruppere hendelser i meldekort
          4. Søk etter årsak: INGEN_INNSENDT,SVART_NEI, MANGLER_INNSENDING, FOR_SEN_INNSENDING, N/A
       */
            meldekort.sort(sorterEtterNyestePeriodeFra);

            return res.status(204).end();
        } catch (err) {
            logger.error(`Feil i /meldekort-inaktivering: ${err}`);
            return res.status(500).end();
        }
    });

    return router;
}

export default meldekortInaktivering;
