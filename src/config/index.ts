export interface IEnvironmentVariables {
    TOKEN_X_WELL_KNOWN_URL: string;
    TOKEN_X_CLIENT_ID: string;
    TOKEN_X_PRIVATE_JWK: string;
    TOKEN_X_TOKEN_ENDPOINT: string;
    UNLEASH_API_URL: string;
    UNLEASH_ENVIRONMENT: string;
    DAGPENGER_INNSYN_URL: string;
    PTO_PROXY_URL: string;
    VEILARBDIALOG_API_URL: string;
    VEILARBREGISTRERING_URL: string;
    VEILARBREGISTRERING_GCP_URL: string;
    NAIS_CLUSTER_NAME: string;
    BASE_PATH: string;
    MELDEKORT_APP_NAME: string;
    MELDEKORT_URL: string;
    IDPORTEN_JWKS_URI: string;
    AZURE_APP_WELL_KNOWN_URL: string;
    AZURE_APP_CLIENT_ID: string;
}

const env = process.env as unknown as IEnvironmentVariables;

export default {
    NAV_COOKIE_NAME: 'selvbetjening-idtoken',
    CONSUMER_ID_HEADER_NAME: 'Nav-Consumer-Id',
    CONSUMER_ID_HEADER_VALUE: 'paw:aia-backend',
    ...env,
};
