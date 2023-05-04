export interface IEnvironmentVariables {
    TOKEN_X_WELL_KNOWN_URL: string;
    TOKEN_X_CLIENT_ID: string;
    TOKEN_X_PRIVATE_JWK: string;
    TOKEN_X_TOKEN_ENDPOINT: string;
    TOKEN_X_JWKS_URI: string;
    UNLEASH_API_URL: string;
    UNLEASH_ENVIRONMENT: string;
    DAGPENGER_INNSYN_URL: string;
    VEILARBDIALOG_API_URL: string;
    DIALOG_APP_NAME: string;
    VEILARBREGISTRERING_URL: string;
    VEILARBOPPFOLGING_URL: string;
    VEILARBVEDTAKINFO_URL: string;
    NAIS_CLUSTER_NAME: string;
    BASE_PATH: string;
    MELDEKORT_APP_NAME: string;
    MELDEKORT_URL: string;
    IDPORTEN_JWKS_URI: string;
    AZURE_APP_WELL_KNOWN_URL: string;
    AZURE_APP_CLIENT_ID: string;
    APP_NAME: string;
    KAFKA_TOPIC: string;
    KAFKA_BROKERS: string;
    KAFKA_CERTIFICATE: string;
    KAFKA_CA: string;
    KAFKA_PRIVATE_KEY: string;
    BESVARELSE_URL: string;
}

const env = process.env as unknown as IEnvironmentVariables;

export default {
    NAV_COOKIE_NAME: 'selvbetjening-idtoken',
    CONSUMER_ID_HEADER_NAME: 'Nav-Consumer-Id',
    CONSUMER_ID_HEADER_VALUE: 'paw:aia-backend',
    ...env,
};
