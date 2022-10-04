import createDagpengerTokenDings, {Auth} from "./dagpengerTokenDings";
import config from "../config"

export interface Dependencies {
  dagpengerTokenDings: Promise<Auth>;
}

function createDependencies(): Dependencies {
  return {
    dagpengerTokenDings: createDagpengerTokenDings({
      tokenXWellKnownUrl: config.TOKEN_X_WELL_KNOWN_URL!,
      tokenXClientId: config.TOKEN_X_CLIENT_ID!,
      tokenXTokenEndpoint: config.TOKEN_X_TOKEN_ENDPOINT!,
      tokenXPrivateJwk: config.TOKEN_X_PRIVATE_JWK!,
      tokenXAudience: config.TOKEN_X_AUDIENCE
    }),
}}

export default createDependencies;
