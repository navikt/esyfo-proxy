import createDagpengerTokenDings, {
  DagpengerTokenDings,
} from "./dagpengerTokenDings";
import config from "./config";

export interface Dependencies {
  dagpengerTokenDings: Promise<DagpengerTokenDings>;
}

function createDependencies(): Dependencies {
  return {
    dagpengerTokenDings: createDagpengerTokenDings(),
  };
}

export default createDependencies;
