import { Issuer, TokenSet } from 'openid-client'
import jwt from 'jsonwebtoken'
import { JWK } from 'node-jose'
import { ulid } from 'ulid'

export interface DagpengerTokenDingsOptions  {
  tokenXWellKnownUrl: string,
  tokenXClientId: string,
  tokenXTokenEndpoint: string,
  tokenXPrivateJwk: string
}

export interface DagpengerTokenDings {
  (idPortenToken: string): Promise<TokenSet>
}

async function createClientAssertion(opts: DagpengerTokenDingsOptions): Promise<string> {
  const { tokenXPrivateJwk, tokenXClientId, tokenXTokenEndpoint } = opts;
  const now = Math.floor(Date.now() / 1000)
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
      { algorithm: 'RS256' }
  )
}

const createDagpengerTokenDings = async (opts: DagpengerTokenDingsOptions): Promise<DagpengerTokenDings> => {
  const { tokenXWellKnownUrl, tokenXClientId } = opts;
  const tokenXIssuer = await Issuer.discover(tokenXWellKnownUrl);
  const tokenXClient = new tokenXIssuer.Client({
    client_id: tokenXClientId,
    token_endpoint_auth_method: 'none'
  });

  const exchangeIdPortenToken = async (idPortenToken: string,) => {
    const clientAssertion = await createClientAssertion(opts);
    const targetAudience = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-innsyn`;

    try {
      return tokenXClient.grant({
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        audience: targetAudience,
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
