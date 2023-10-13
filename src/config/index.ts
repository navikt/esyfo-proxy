export interface IEnvironmentVariables {
  TOKEN_X_WELL_KNOWN_URL: string;
  TOKEN_X_CLIENT_ID: string;
  TOKEN_X_PRIVATE_JWK: string;
  TOKEN_X_TOKEN_ENDPOINT: string;
  TOKEN_X_JWKS_URI: string;
  TOKEN_X_ISSUER: string;
  AKTIVITETSKRAV_BACKEND_HOST: string;
  AKTIVITETSKRAV_BACKEND_CLIENT_ID: string;
  SYFOMOTEBEHOV_HOST: string;
  SYFOMOTEBEHOV_CLIENT_ID: string;
  ISDIALOGMOTE_HOST: string;
  ISDIALOGMOTE_CLIENT_ID: string;
  NAIS_CLUSTER_NAME: string;
  BASE_PATH: string;
  IDPORTEN_JWKS_URI: string;
  APP_NAME: string;
  SSO_NAV_COOKIE: string;
}

const env = process.env as unknown as IEnvironmentVariables;

export default {
  CONSUMER_ID_HEADER_NAME: "Nav-Consumer-Id",
  CONSUMER_ID_HEADER_VALUE: "team-esyfo:esyfo-proxy",
  ...env,
};
