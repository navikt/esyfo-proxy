import createDagpengerTokenDings, {
  DagpengerTokenDings,
} from "./dagpengerTokenDings";

export interface Dependencies {
  dagpengerTokenDings: Promise<DagpengerTokenDings>;
}

function createDependencies(): Dependencies {
  return {
    dagpengerTokenDings: createDagpengerTokenDings({
      tokenXWellKnownUrl: process.env.TOKEN_X_WELL_KNOWN_URL!,
      tokenXClientId: process.env.TOKEN_X_CLIENT_ID!,
      tokenXTokenEndpoint: process.env.TOKEN_X_TOKEN_ENDPOINT!,
      tokenXPrivateJwk: process.env.TOKEN_X_PRIVATE_JWK!
    }),
  };
}

export default createDependencies;
