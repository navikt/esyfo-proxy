import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import motebehovRoutes from "../src/api/motebehovRoutes";

jest.mock("../src/config", () => {
  const config = jest.requireActual("../src/config");
  return {
    ...config.default,
    SSO_NAV_COOKIE: "sso-nav.no",
    SYFOMOTEBEHOV_CLIENT_ID: "test-gcp:team-esyfo:syfomotebehov",
    SYFOMOTEBEHOV_HOST: "http://localhost:6667",
  };
});

describe("motebehov routes", () => {
  it("kaller motebehov-api med token-x i header", async () => {
    const tokenDings = {
      exchangeIDPortenToken: jest
        .fn()
        .mockReturnValue(Promise.resolve("tokenX-123")),
      verifyIDPortenToken: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const proxyServer = express();
    proxyServer.get(
      "/syfomotebehov/api/v4/arbeidstaker/motebehov",
      (req, res) => {
        if (req.header("Authorization") === "Bearer tokenX-123") {
          res.status(200).send("ok");
        } else {
          res.status(400).end();
        }
      },
    );
    const proxy = proxyServer.listen(6667);

    const app = express();
    app.use(cookieParser());
    app.use(motebehovRoutes(tokenDings));

    try {
      const response = await request(app)
        .get("/api/motebehov")
        .set("Cookie", ["sso-nav.no=token123;"]);

      expect(tokenDings.exchangeIDPortenToken).toBeCalledWith(
        "token123",
        "test-gcp:team-esyfo:syfomotebehov",
      );
      expect(response.statusCode).toEqual(200);
      expect(response.text).toBe("ok");
    } finally {
      proxy.close();
    }
  });
});
