import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import aktivitetspliktRoutes from "../src/api/aktivitetspliktRoutes";

jest.mock("../src/config", () => {
  const config = jest.requireActual("../src/config");
  return {
    ...config.default,
    SSO_NAV_COOKIE: "sso-nav.no",
    AKTIVITETSKRAV_BACKEND_CLIENT_ID:
      "test-gcp:team-esyfo:aktivitetskrav-backend",
    AKTIVITETSKRAV_BACKEND_HOST: "http://localhost:6669",
  };
});

describe("aktivitetsplikt routes", () => {
  it("kaller aktivitetsplikt-api med token-x i header", async () => {
    const tokenDings = {
      exchangeIDPortenToken: jest
        .fn()
        .mockReturnValue(Promise.resolve({ access_token: "tokenX-123" })),
      verifyIDPortenToken: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const proxyServer = express();
    proxyServer.get("/api/v1/aktivitetsplikt", (req, res) => {
      if (req.header("Authorization") === "Bearer tokenX-123") {
        res.status(200).send("ok");
      } else {
        res.status(400).end();
      }
    });
    const proxy = proxyServer.listen(6669);

    const app = express();
    app.use(cookieParser());
    app.use(aktivitetspliktRoutes(tokenDings));

    try {
      const response = await request(app)
        .get("/api/aktivitetsplikt")
        .set("Cookie", ["sso-nav.no=token123;"]);

      expect(tokenDings.exchangeIDPortenToken).toBeCalledWith(
        "token123",
        "test-gcp:team-esyfo:aktivitetskrav-backend",
      );
      expect(response.statusCode).toEqual(200);
      expect(response.text).toBe("ok");
    } finally {
      proxy.close();
    }
  });
});
