import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import meroppfolgingRoutes from "../src/api/meroppfolgingRoutes";

jest.mock("../src/config", () => {
  const config = jest.requireActual("../src/config");
  return {
    ...config.default,
    SSO_NAV_COOKIE: "sso-nav.no",
    MEROPPFOLGING_BACKEND_CLIENT_ID:
      "test-gcp:team-esyfo:meroppfolging-backend",
    MEROPPFOLGING_BACKEND_HOST: "http://localhost:6670",
  };
});

describe("meroppfolging routes", () => {
  it("kaller meroppfolging-api med token-x i header", async () => {
    const tokenDings = {
      exchangeIDPortenToken: jest
        .fn()
        .mockReturnValue(Promise.resolve("tokenX-123")),
      verifyIDPortenToken: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const proxyServer = express();
    proxyServer.get("/api/v2/senoppfolging/status", (req, res) => {
      if (req.header("Authorization") === "Bearer tokenX-123") {
        res.status(200).send("ok");
      } else {
        res.status(400).end();
      }
    });
    const proxy = proxyServer.listen(6670);

    const app = express();
    app.use(cookieParser());
    app.use(meroppfolgingRoutes(tokenDings));

    try {
      const response = await request(app)
        .get("/api/meroppfolging/v2/senoppfolging/status")
        .set("Cookie", ["sso-nav.no=token123;"]);

      expect(tokenDings.exchangeIDPortenToken).toBeCalledWith(
        "token123",
        "test-gcp:team-esyfo:meroppfolging-backend",
      );
      expect(response.statusCode).toEqual(200);
      expect(response.text).toBe("ok");
    } finally {
      proxy.close();
    }
  });
});
