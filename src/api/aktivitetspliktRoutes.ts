import { Auth, getTokenFromRequest } from "../auth/tokenDings";
import config from "../config";
import { Request, Router } from "express";
import { proxyTokenXCall } from "../http";

function aktivitetspliktRoutes(tokenDings: Auth) {
  const router = Router();

  const getTokenXHeaders = async (req: Request) => {
    const incomingToken = getTokenFromRequest(req);
    const access_token = await tokenDings.exchangeIDPortenToken(
      incomingToken,
      config.AKTIVITETSKRAV_BACKEND_CLIENT_ID,
    );
    return { Authorization: `Bearer ${access_token}` };
  };

  router.get(
    "/api/aktivitetsplikt",
    proxyTokenXCall(
      `${config.AKTIVITETSKRAV_BACKEND_HOST}/api/v1/aktivitetsplikt`,
      getTokenXHeaders,
    ),
  );

  return router;
}

export default aktivitetspliktRoutes;