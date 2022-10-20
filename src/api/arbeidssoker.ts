import { Router } from 'express';
import config from '../config';
import log from '../logger';
import axios, { AxiosError } from 'axios';
import { ParsedQs } from 'qs';
import { getTokenFromCookie } from '../auth/tokenDings';

interface Arbeidssokerperioder {
    status: number;
    arbeidssokerperioder: [{ fraOgMed: string; tilOgMed?: string }?];
}

interface UnderOppfolging {
    status: number;
    underoppfolging: boolean;
}

function arbeidssokerRoutes(
    ptoProxyUrl = config.PTO_PROXY_URL,
    veilarbregistreringUrl = config.VEILARBREGISTRERING_URL
) {
    const router = Router();

    /**
     * @openapi
     * /arbeidssoker:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/arbeidssoker', async (req, res) => {
        const token = getTokenFromCookie(req);

        if (!token) {
            return res.status(401).end();
        }

        const arbeidssokerperioder = await hentArbeidssokerPerioder(token, req.query);
        const underoppfolging = await hentUnderOppfolging(token);

        return res.send({
            underoppfolging,
            arbeidssokerperioder,
        });
    });

    /**
     * @openapi
     * /er-arbeidssoker:
     *   get:
     *     description:
     *     responses:
     *       200:
     *         description: Vellykket forespørsel.
     *       401:
     *         description: Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie.
     */
    router.get('/er-arbeidssoker', async (req, res) => {
        const token = getTokenFromCookie(req);

        if (!token) {
            return res.status(401).end();
        }

        const perioder = await hentArbeidssokerPerioder(token, { fraOgMed: '2020-01-01' });
        const underOppfolging = await hentUnderOppfolging(token);
        const erUnderOppfolging = underOppfolging.underoppfolging;
        const erArbeidssoker = erUnderOppfolging || perioder.arbeidssokerperioder.length > 0;
        return res.send({ erArbeidssoker });
    });

    async function hentArbeidssokerPerioder(token: string, query: ParsedQs): Promise<Arbeidssokerperioder> {
        const fraOgMed = query.fraOgMed;
        const tilOgMed = query.tilOgMed;
        const url = `${veilarbregistreringUrl}/veilarbregistrering/api/arbeidssoker/perioder/niva3?fraOgMed=${fraOgMed}${
            tilOgMed ? `&tilOgMed=${tilOgMed}` : ''
        }`;

        try {
            const { data, status } = await axios(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    [config.CONSUMER_ID_HEADER_NAME]: config.CONSUMER_ID_HEADER_VALUE,
                },
            });
            return {
                status,
                ...data,
            };
        } catch (err) {
            log.error(err);
            return {
                status: (err as AxiosError).response?.status || 500,
                arbeidssokerperioder: [],
            };
        }
    }

    async function hentUnderOppfolging(token: string): Promise<UnderOppfolging> {
        try {
            const { data, status } = await axios(`${ptoProxyUrl}/veilarboppfolging/api/niva3/underoppfolging`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    [config.CONSUMER_ID_HEADER_NAME]: config.CONSUMER_ID_HEADER_VALUE,
                },
            });
            return {
                status,
                underoppfolging: Boolean(data.underOppfolging),
            };
        } catch (err) {
            log.error(err);
            return {
                status: (err as AxiosError).response?.status || 500,
                underoppfolging: false,
            };
        }
    }
    return router;
}

export default arbeidssokerRoutes;
