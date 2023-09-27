import { Router } from 'express';
import { Auth } from '../../../auth/tokenDings';
import config from '../../../config';
import axios from 'axios';
import { getDefaultHeaders } from '../../../http';
import { getTokenXHeadersForVeilarboppfolging } from '../../oppfolging';
import { getTokenXHeadersForVeilarbregistrering } from '../../veilarbregistrering';
import { getTokenXHeadersForDialog } from '../../dialog';
import { ProfilRepository } from '../../../db/profilRepository';
import { ValidatedRequest } from '../../../middleware/token-validation';
import logger from '../../../logger';
import { BehovRepository } from '../../../db/behovForVeiledningRepository';

function arbeidssokerInnhold(
    tokenDings: Auth,
    profilRepository: ProfilRepository,
    behovForVeiledningRepository: BehovRepository,
    veilarboppfolgingUrl = config.VEILARBOPPFOLGING_URL,
    veilarbregistreringUrl = config.VEILARBREGISTRERING_URL,
    dialogApiUrl = config.VEILARBDIALOG_API_URL,
) {
    const hentProfil = async (ident: string) => {
        try {
            const profil = await profilRepository.hentProfil(ident as string);
            if (!profil) {
                return {
                    status: 204,
                };
            }
            return {
                status: 200,
                data: profil,
            };
        } catch (err) {
            logger.error(`Feil ved henting av profil: ${err}`);
            return { error: (err as Error)?.message, status: 500 };
        }
    };

    const hentBehovForVeiledning = async (ident: string) => {
        try {
            const behov = await behovForVeiledningRepository.hentBehov({ bruker_id: ident });

            if (!behov) {
                return { status: 204 };
            }

            return {
                status: 200,
                data: { oppfolging: behov.oppfolging, dato: behov.created_at, dialogId: behov.dialog_id },
            };
        } catch (err) {
            logger.error(`Feil ved henting av behov for veiledning: ${err}`);
            return { error: (err as Error)?.message, status: 500 };
        }
    };
    const router = Router();
    const timeout = 3000;
    router.get('/data/arbeidssoker-innhold', async (req, res) => {
        try {
            const ident = (req as ValidatedRequest).user.ident;
            const requests = await Promise.allSettled([
                axios(`${veilarboppfolgingUrl}/veilarboppfolging/api/oppfolging`, {
                    timeout,
                    headers: {
                        ...getDefaultHeaders(req),
                        ...(await getTokenXHeadersForVeilarboppfolging(tokenDings)(req)),
                    },
                }),
                axios(`${veilarbregistreringUrl}/veilarbregistrering/api/registrering`, {
                    timeout,
                    headers: {
                        ...getDefaultHeaders(req),
                        ...(await getTokenXHeadersForVeilarbregistrering(tokenDings)(req)),
                    },
                }),
                axios(`${veilarbregistreringUrl}/veilarbregistrering/api/startregistrering`, {
                    timeout,
                    headers: {
                        ...getDefaultHeaders(req),
                        ...(await getTokenXHeadersForVeilarbregistrering(tokenDings)(req)),
                    },
                }),
                axios(`${dialogApiUrl}/dialog/antallUleste`, {
                    timeout,
                    headers: {
                        ...getDefaultHeaders(req),
                        ...(await getTokenXHeadersForDialog(tokenDings)(req)),
                    },
                }),
                // todo: dagpenger-status
            ]);

            const requestKeys = ['oppfolging', 'brukerregistrering', 'brukerInfo', 'ulesteDialoger'];

            const result = requests.reduce(
                (acc, currentValue, currentIndex) => {
                    let currentResult;
                    if (currentValue.status === 'fulfilled') {
                        currentResult = {
                            status: currentValue.value.status,
                            data: currentValue.value.data,
                        };
                    }
                    if (currentValue.status === 'rejected') {
                        currentResult = {
                            error: currentValue.reason.message,
                            status: currentValue.reason.status,
                        };
                    }
                    return {
                        ...acc,
                        [requestKeys[currentIndex]]: {
                            ...currentResult,
                        },
                    };
                },
                {
                    profil: await hentProfil(ident),
                    behovForVeiledning: await hentBehovForVeiledning(ident),
                },
            );
            res.status(200).send(result);
        } catch (err) {
            res.status(500).end();
        }
    });
    return router;
}

export default arbeidssokerInnhold;
