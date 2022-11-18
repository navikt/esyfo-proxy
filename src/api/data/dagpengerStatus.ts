import { Request, Router } from 'express';
import config from '../../config';
import axios from 'axios';
import { hentArbeidssokerPerioder } from '../arbeidssoker';
import { Auth, getTokenFromCookie } from '../../auth/tokenDings';
import beregnDagpengeStatus from './beregnDagpengeStatus';
import beregnArbeidssokerperioder from './beregnArbeidssokerPerioder';
import logger from '../../logger';

function dagpengerStatus(
    tokenDings: Auth,
    dagpengerInnsynUrl = config.DAGPENGER_INNSYN_URL,
    veilarbregistreringUrl = config.VEILARBREGISTRERING_URL,
    veilarbregistreringGcpUrl = config.VEILARBREGISTRERING_GCP_URL
) {
    const router = Router();

    router.get('/dagpenger-status', async (req, res) => {
        const token = getTokenFromCookie(req);
        const DP_INNSYN_CLIENT_ID = `${config.NAIS_CLUSTER_NAME}:teamdagpenger:dp-innsyn`;

        const getTokenXHeaders = async (req: Request) => {
            const idPortenToken = getTokenFromCookie(req);
            const tokenSet = await tokenDings.exchangeIDPortenToken(idPortenToken, DP_INNSYN_CLIENT_ID);
            const token = tokenSet.access_token;
            return { Authorization: `Bearer ${token}`, TokenXAuthorization: `Bearer ${token}` };
        };

        try {
            const headers = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    [config.CONSUMER_ID_HEADER_NAME]: config.CONSUMER_ID_HEADER_VALUE,
                },
            };
            const tokenXHeaders = {
                headers: await getTokenXHeaders(req),
            };

            const requests = await Promise.all([
                axios(`${veilarbregistreringGcpUrl}/veilarbregistrering/api/startregistrering`, headers),
                axios(`${veilarbregistreringUrl}/veilarbregistrering/api/registrering`, headers),
                hentArbeidssokerPerioder(veilarbregistreringGcpUrl, token, { fraOgMed: '2020-01-01' }),
                axios(`${dagpengerInnsynUrl}/paabegynte`, tokenXHeaders),
                axios(`${dagpengerInnsynUrl}/soknad`, tokenXHeaders),
                axios(`${dagpengerInnsynUrl}/vedtak`, tokenXHeaders),
            ]);

            const brukerInfoData = requests[0].data;
            const registreringData = requests[1].data;
            const arbeidssokerperioderData = requests[2].arbeidssokerperioder;
            const paabegynteSoknader = requests[3].data || [];
            const innsendteSoknader = requests[4].data || [];
            const dagpengeVedtak = requests[5].data || [];

            const arbeidssokerperioder = beregnArbeidssokerperioder({
                arbeidssokerperioder: arbeidssokerperioderData || [],
            });

            const dagpengerStatus = beregnDagpengeStatus({
                brukerInfoData,
                registreringData,
                paabegynteSoknader,
                innsendteSoknader,
                dagpengeVedtak,
                arbeidssokerperioder,
            });

            res.status(200).send({ dagpengerStatus });
        } catch (err) {
            logger.error(err);
            res.status(500).end();
        }
    });

    return router;
}

export default dagpengerStatus;
