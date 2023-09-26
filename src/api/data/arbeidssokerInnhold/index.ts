import { Router } from 'express';
import { Auth } from '../../../auth/tokenDings';
import config from '../../../config';
import axios from 'axios';
import { getDefaultHeaders } from '../../../http';
import { getTokenXHeadersForVeilarboppfolging } from '../../oppfolging';
import { getTokenXHeadersForVeilarbregistrering } from '../../veilarbregistrering';
import { getTokenXHeadersForDialog } from '../../dialog';

function arbeidssokerInnhold(
    tokenDings: Auth,
    veilarboppfolgingUrl = config.VEILARBOPPFOLGING_URL,
    veilarbregistreringUrl = config.VEILARBREGISTRERING_URL,
    dialogApiUrl = config.VEILARBDIALOG_API_URL,
) {
    const router = Router();
    router.get('/data/arbeidssoker-innhold', async (req, res) => {
        try {
            const requests = await Promise.allSettled([
                axios(`${veilarboppfolgingUrl}/veilarboppfolging/api/oppfolging`, {
                    headers: {
                        ...getDefaultHeaders(req),
                        ...(await getTokenXHeadersForVeilarboppfolging(tokenDings)(req)),
                    },
                }),
                axios(`${veilarbregistreringUrl}/veilarbregistrering/api/registrering`, {
                    headers: {
                        ...getDefaultHeaders(req),
                        ...(await getTokenXHeadersForVeilarbregistrering(tokenDings)(req)),
                    },
                }),
                axios(`${veilarbregistreringUrl}/veilarbregistrering/api/startregistrering`, {
                    headers: {
                        ...getDefaultHeaders(req),
                        ...(await getTokenXHeadersForVeilarbregistrering(tokenDings)(req)),
                    },
                }),
                axios(`${dialogApiUrl}/dialog/antallUleste`, {
                    headers: {
                        ...getDefaultHeaders(req),
                        ...(await getTokenXHeadersForDialog(tokenDings)(req)),
                    },
                }),
                // profil: todo
                // behov for veiledning: todo
                // todo: dagpenger-status
            ]);

            const requestKeys = ['oppfolging', 'brukerregistrering', 'brukerInfo', 'ulesteDialoger'];

            const result = requests.reduce((acc, currentValue, currentIndex) => {
                let currentResult;
                if (currentValue.status === 'fulfilled') {
                    currentResult = {
                        status: currentValue.value.status,
                        data: currentValue.value.data,
                    };
                }
                if (currentValue.status === 'rejected') {
                    currentResult = {
                        error: currentValue.reason,
                    };
                }
                return {
                    ...acc,
                    [requestKeys[currentIndex]]: {
                        ...currentResult,
                    },
                };
            }, {});
            res.status(200).send(result);
        } catch (err) {
            res.status(500).end();
        }
    });
    return router;
}

export default arbeidssokerInnhold;
