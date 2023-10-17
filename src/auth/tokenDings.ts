import type { Request } from "express";
import { Issuer } from "openid-client";
import jwt from "jsonwebtoken";
import { JWK } from "node-jose";
import { ulid } from "ulid";
import logger from "../logger";
import config from "../config";
import { getTokenInCache, setTokenInCache } from "./cache/cache-actions";

export interface ExchangeToken {
  (idPortenToken: string, targetApp: string): Promise<string | undefined>;
}

export interface Auth {
  exchangeIDPortenToken: ExchangeToken;
}

export interface TokenDingsOptions {
  tokenXWellKnownUrl: string;
  tokenXClientId: string;
  tokenXTokenEndpoint: string;
  tokenXPrivateJwk: string;
}

export function getTokenFromRequest(req: Request) {
  return getTokenFromHeader(req) || getTokenFromCookie(req);
}

function getTokenFromCookie(req: Request) {
  return req.cookies && req.cookies[config.SSO_NAV_COOKIE];
}

export function getTokenFromHeader(req: Request) {
  return req.headers.authorization?.replace("Bearer ", "");
}

async function createClientAssertion(
  options: TokenDingsOptions,
): Promise<string> {
  const { tokenXPrivateJwk, tokenXClientId, tokenXTokenEndpoint } = options;

  const now = Math.floor(Date.now() / 1000);
  const key = await JWK.asKey(tokenXPrivateJwk);
  return jwt.sign(
    {
      sub: tokenXClientId,
      aud: tokenXTokenEndpoint,
      iss: tokenXClientId,
      exp: now + 60, // max 120
      iat: now,
      jti: ulid(),
      nbf: now,
    },
    key.toPEM(true),
    { algorithm: "RS256" },
  );
}

const createTokenDings = async (options: TokenDingsOptions): Promise<Auth> => {
  const { tokenXWellKnownUrl, tokenXClientId } = options;
  const tokenXIssuer = await Issuer.discover(tokenXWellKnownUrl);
  const tokenXClient = new tokenXIssuer.Client({
    client_id: tokenXClientId,
    token_endpoint_auth_method: "none",
  });

  return {
    async exchangeIDPortenToken(
      idPortenToken: string,
      targetApp: string,
    ): Promise<string | undefined> {
      const cacheKey = `tokenx-${idPortenToken}-${targetApp}`;
      const [cacheHit, tokenInCache] = getTokenInCache(cacheKey);
      if (cacheHit) return tokenInCache;

      const clientAssertion = await createClientAssertion(options);

      try {
        const tokenSet = await tokenXClient.grant({
          grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
          audience: targetApp,
          client_assertion: clientAssertion,
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          subject_token: idPortenToken,
          subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
          token_endpoint_auth_method: "private_key_jwt",
        });
        setTokenInCache(cacheKey, tokenSet);
        return tokenSet.access_token;
      } catch (err: unknown) {
        logger.error(`Feil under token exchange: ${err}`);
        return Promise.reject(err);
      }
    },
  };
};

export default createTokenDings;
