import axios, {AxiosError} from 'axios';
import {Request, Response, Router} from 'express';
const NAV_COOKIE_NAME = "selvbetjening-idtoken";
const CONSUMER_ID_HEADER_NAME = "Nav-Consumer-Id";
const CONSUMER_ID_HEADER_VALUE = "paw:bakveientilarbeid";

function ptoProxyCall(url: string) {
  return async (req: Request, res: Response) => {
    const token = req.cookies[NAV_COOKIE_NAME];
    try {
      const { data } = await axios.get(url, {
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          Authorization: `Bearer ${token}`,
          [CONSUMER_ID_HEADER_NAME]: CONSUMER_ID_HEADER_VALUE,
        },
        responseType: "stream",
      });
      data.pipe(res);
    } catch (err) {
      console.error(err);
      const status = (err as AxiosError).response?.status || 500;
      res.status(status).send((err as Error).message);
    }
  }
}

function ptoProxy() {
  const router = Router();
  router.get("/oppfolging", ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarboppfolging/api/oppfolging`));
  router.get("/underoppfolging", ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarboppfolging/api/niva3/underoppfolging`));
  router.get('/startregistrering', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbregistrering/api/startregistrering`));
  router.get('/registrering', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbregistrering/api/registrering`));
  router.get('/standard-innsats', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbregistrering/api/profilering/standard-innsats`));
  router.get('/dialog/antallUleste', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbdialog/api/dialog/antallUleste`));
  router.get('/vedtakinfo/besvarelse', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbvedtakinfo/api/behovsvurdering/besvarelse`));
  router.get('/vedtakinfo/motestotte', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbvedtakinfo/api/motestotte`));
  // TODO
  //router.get('/arbeidssoker/perioder', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbregistrering/api/arbeidssoker/perioder`));
  router.get('/gjelderfra', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbregistrering/api/registrering/gjelderfra`));
  // TODO
  //router.post('/gjelderfra', ptoProxyCall(`${process.env.PTO_PROXY_URL}/veilarbregistrering/api/registrering/gjelderfra`));

  return router;
}

export default ptoProxy;
