import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";
import isdialogmoteRoutes from "../src/api/isdialogmoteRoutes";

jest.mock("../src/config", () => {
  const config = jest.requireActual("../src/config");
  return {
    ...config.default,
    SSO_NAV_COOKIE: "sso-nav.no",
    ISDIALOGMOTE_CLIENT_ID: "test-gcp:teamsykefravr:isdialogmote",
    ISDIALOGMOTE_HOST: "http://localhost:6668",
  };
});

describe("isdialogmote routes", () => {
  it("kaller dialogmote-api med token-x i header", async () => {
    const tokenDings = {
      exchangeIDPortenToken: jest
        .fn()
        .mockReturnValue(Promise.resolve("tokenX-123")),
      verifyIDPortenToken: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const proxyServer = express();
    proxyServer.get("/api/v2/arbeidstaker/brev", (req, res) => {
      if (req.header("Authorization") === "Bearer tokenX-123") {
        res.status(200).send("ok");
      } else {
        res.status(400).end();
      }
    });
    const proxy = proxyServer.listen(6668);

    const app = express();
    app.use(cookieParser());
    app.use(isdialogmoteRoutes(tokenDings));

    try {
      const response = await request(app)
        .get("/api/dialogmote")
        .set("Cookie", ["sso-nav.no=token123;"]);

      expect(tokenDings.exchangeIDPortenToken).toBeCalledWith(
        "token123",
        "test-gcp:teamsykefravr:isdialogmote",
      );
      expect(response.statusCode).toEqual(200);
      expect(response.text).toBe("ok");
    } finally {
      proxy.close();
    }
  });
});
