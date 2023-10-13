import { Auth, getTokenFromRequest } from "../auth/tokenDings";
import config from "../config";
import { Request, Router } from "express";
import { proxyTokenXCall } from "../http";

function isdialogmoteRoutes(tokenDings: Auth) {
  const router = Router();

  const getTokenXHeaders = async (req: Request) => {
    const incomingToken = getTokenFromRequest(req);
    const access_token = await tokenDings.exchangeIDPortenToken(
      incomingToken,
      config.ISDIALOGMOTE_CLIENT_ID,
    );
    return { Authorization: `Bearer ${access_token}` };
  };

  router.get(
    "/api/dialogmote",
    proxyTokenXCall(
      `${config.ISDIALOGMOTE_HOST}/api/v2/arbeidstaker/brev`,
      getTokenXHeaders,
    ),
  );

  return router;
}

export default isdialogmoteRoutes;
