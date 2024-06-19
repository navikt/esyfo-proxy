import { Auth, getTokenFromRequest } from "../auth/tokenDings";
import config from "../config";
import { Request, Router } from "express";
import { proxyTokenXCall } from "../http";

function meroppfolgingRoutes(tokenDings: Auth) {
  const router = Router();

  const getTokenXHeaders = async (req: Request) => {
    const incomingToken = getTokenFromRequest(req);
    const access_token = await tokenDings.exchangeIDPortenToken(
      incomingToken,
      config.MEROPPFOLGING_BACKEND_CLIENT_ID,
    );
    return { Authorization: `Bearer ${access_token}` };
  };

  router.get(
    "/api/meroppfolging/v2/senoppfolging/status",
    proxyTokenXCall(
      `${config.MEROPPFOLGING_BACKEND_HOST}/api/v2/senoppfolging/status`,
      getTokenXHeaders,
    ),
  );

  return router;
}

export default meroppfolgingRoutes;
