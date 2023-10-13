import { Auth, getTokenFromRequest } from "../auth/tokenDings";
import config from "../config";
import { Request, Router } from "express";
import { proxyTokenXCall } from "../http";

function motebehovRoutes(tokenDings: Auth) {
  const router = Router();

  const getTokenXHeaders = async (req: Request) => {
    const incomingToken = getTokenFromRequest(req);
    const access_token = await tokenDings.exchangeIDPortenToken(
      incomingToken,
      config.SYFOMOTEBEHOV_CLIENT_ID,
    );
    return { Authorization: `Bearer ${access_token}` };
  };

  router.get(
    "/api/motebehov",
    proxyTokenXCall(
      `${config.SYFOMOTEBEHOV_HOST}/syfomotebehov/api/v3/arbeidstaker/motebehov/all`,
      getTokenXHeaders,
    ),
  );

  return router;
}

export default motebehovRoutes;
