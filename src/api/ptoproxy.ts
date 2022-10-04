import axios, { AxiosError } from "axios";
import { Router } from "express";
const NAV_COOKIE_NAME = "selvbetjening-idtoken";
const CONSUMER_ID_HEADER_NAME = "Nav-Consumer-Id";
const CONSUMER_ID_HEADER_VALUE = "paw:bakveientilarbeid";

function ptoProxy() {
  const router = Router();

  router.get("/oppfolging", async (req, res) => {
    const token = req.cookies[NAV_COOKIE_NAME];
    const url = `${process.env.PTO_PROXY_URL}/veilarboppfolging/api/oppfolging`;
    console.log('URL', url);
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          [CONSUMER_ID_HEADER_NAME]: CONSUMER_ID_HEADER_VALUE,
        },
        responseType: "stream",
      });
      console.log('DATA')
      data.pipe(res);
      res.end();
    } catch (err) {
      console.error(err);
      const status = (err as AxiosError).response?.status || 500;
      res.status(status).send((err as Error).message);
    }
  });

  return router;
}

export default ptoProxy;
