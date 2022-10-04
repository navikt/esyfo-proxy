import {Router} from 'express';
import {CONSUMER_ID_HEADER_NAME, CONSUMER_ID_HEADER_VALUE, NAV_COOKIE_NAME} from '../config';
import {DagpengerTokenDings} from '../dagpengerTokenDings';
import axios, {AxiosError} from 'axios';

const DAGPENGER_INNSYN_URL = "http://dp-innsyn.teamdagpenger.svc.cluster.local"
const SOKNAD_URL = `${DAGPENGER_INNSYN_URL}/soknad`;
// const VEDTAK_URL = `${DAGPENGER_INNSYN_URL}/vedtak`;
// const PABEGYNTE_SOKNADER_URL = `${DAGPENGER_INNSYN_URL}/paabegynte`;

function dagpengerRoutes(createDagpengerTokenDings: DagpengerTokenDings) {
  const router = Router();
  router.get('/dagpenger/soknad', async (req, res) => {
    const dagpengerTokenDings = await createDagpengerTokenDings;
    const idPortenToken = req.cookies[NAV_COOKIE_NAME];
    const tokenSet = await dagpengerTokenDings(idPortenToken);
    const token = tokenSet.access_token;
    try {
      const { data } = await axios.get(SOKNAD_URL, {
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          Authorization: `Bearer ${token}`,
          TokenXAuthorization: `Bearer ${token}`,
          [CONSUMER_ID_HEADER_NAME]: CONSUMER_ID_HEADER_VALUE,
        },
        responseType: 'stream',
      });
      data.pipe(res);
    } catch (err) {
      console.error(err);
      const status = (err as AxiosError).response?.status || 500;
      res.status(status).send((err as Error).message);
    }
  });

  return router;
}

export default dagpengerRoutes;
