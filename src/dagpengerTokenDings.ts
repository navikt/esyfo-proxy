import { Issuer, TokenSet } from 'openid-client'
import jwt from 'jsonwebtoken'
import { JWK } from 'node-jose'
import { ulid } from 'ulid'
import config from './config'

export interface DagpengerTokenDings {
  (idPortenToken: string): Promise<TokenSet>
}

async function createClientAssertion(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const key = await JWK.asKey(config.TOKEN_X_PRIVATE_JWK);
  return jwt.sign(
      {
        sub: config.TOKEN_X_CLIENT_ID,
        aud: config.TOKEN_X_TOKEN_ENDPOINT,
        iss: config.TOKEN_X_CLIENT_ID,
        exp: now + 60, // max 120
        iat: now,
        jti: ulid(),
        nbf: now,
      },
      key.toPEM(true),
      { algorithm: 'RS256' }
  )
}

const createDagpengerTokenDings = async (): Promise<DagpengerTokenDings> => {
  const tokenXIssuer = await Issuer.discover(config.TOKEN_X_WELL_KNOWN_URL);
  const tokenXClient = new tokenXIssuer.Client({
    client_id: config.TOKEN_X_CLIENT_ID,
    token_endpoint_auth_method: 'none'
  });

  const exchangeIdPortenToken = async (idPortenToken: string) => {
    const clientAssertion = await createClientAssertion();

    try {
      return tokenXClient.grant({
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        audience: config.TOKEN_X_AUDIENCE,
        client_assertion: clientAssertion,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        subject_token: idPortenToken,
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_endpoint_auth_method: 'private_key_jwt',
      })
    } catch (err: unknown) {
      console.error(`Feil under token exchange: ${err}`)
      return Promise.reject(err)
    }
  }

  return exchangeIdPortenToken;
}

export default createDagpengerTokenDings;
