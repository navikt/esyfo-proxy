import { AxiosError } from 'axios';

const SAFE_HTTP_METHODS = ['get', 'head', 'options'];
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);

const denyList = new Set([
    'ENOTFOUND',
    'ENETUNREACH',

    // SSL errors from https://github.com/nodejs/node/blob/fc8e3e2cdc521978351de257030db0076d79e0ab/src/crypto/crypto_common.cc#L301-L328
    'UNABLE_TO_GET_ISSUER_CERT',
    'UNABLE_TO_GET_CRL',
    'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
    'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
    'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
    'CERT_SIGNATURE_FAILURE',
    'CRL_SIGNATURE_FAILURE',
    'CERT_NOT_YET_VALID',
    'CERT_HAS_EXPIRED',
    'CRL_NOT_YET_VALID',
    'CRL_HAS_EXPIRED',
    'ERROR_IN_CERT_NOT_BEFORE_FIELD',
    'ERROR_IN_CERT_NOT_AFTER_FIELD',
    'ERROR_IN_CRL_LAST_UPDATE_FIELD',
    'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
    'OUT_OF_MEM',
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'SELF_SIGNED_CERT_IN_CHAIN',
    'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    'CERT_CHAIN_TOO_LONG',
    'CERT_REVOKED',
    'INVALID_CA',
    'PATH_LENGTH_EXCEEDED',
    'INVALID_PURPOSE',
    'CERT_UNTRUSTED',
    'CERT_REJECTED',
    'HOSTNAME_MISMATCH',
]);

function isRetryAllowed(error: AxiosError) {
    return !denyList.has(error && error.code!);
}

function isNetworkError(error: AxiosError) {
    return (
        !error.response &&
        Boolean(error.code) && // Prevents retrying cancelled requests
        error.code !== 'ECONNABORTED' && // Prevents retrying timed out requests
        isRetryAllowed(error)
    ); // Prevents retrying unsafe errors
}
function isRetryableError(error: AxiosError) {
    return (
        error.code !== 'ECONNABORTED' &&
        (!error.response || (error.response.status >= 500 && error.response.status <= 599))
    );
}
function isIdempotentRequestError(error: AxiosError) {
    if (!error.config) {
        // Cannot determine if the request can be retried
        return false;
    }

    return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method!) !== -1;
}

function isNetworkOrIdempotentRequestError(error: AxiosError) {
    return isNetworkError(error) || isIdempotentRequestError(error);
}

export { isNetworkOrIdempotentRequestError };
