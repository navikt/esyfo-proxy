export interface IEnvironmentVariables {
    TOKEN_X_WELL_KNOWN_URL: string;
    TOKEN_X_CLIENT_ID: string;
    TOKEN_X_PRIVATE_JWK: string;
    TOKEN_X_TOKEN_ENDPOINT: string;
    UNLEASH_API_URL: string;
    DAGPENGER_INNSYN_URL: string;
    PTO_PROXY_URL: string;
    NAIS_CLUSTER_NAME: string;
    NAIS_DATABASE_AIA_BACKEND_PROFIL_URL: string;
    BASE_PATH: string;
    MELDEKORT_APP_NAME: string;
    MELDEKORT_URL: string;
}

const env = process.env as unknown as IEnvironmentVariables;

if (env['NAIS_DATABASE_AIA_BACKEND_PROFIL_URL']) process.env.DATABASE_URL = env['NAIS_DATABASE_AIA_BACKEND_PROFIL_URL'];

export default {
    NAV_COOKIE_NAME: 'selvbetjening-idtoken',
    CONSUMER_ID_HEADER_NAME: 'Nav-Consumer-Id',
    CONSUMER_ID_HEADER_VALUE: 'paw:aia-backend',
    ...env,
};
