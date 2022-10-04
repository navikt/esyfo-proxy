import createDagpengerTokenDings, {
  DagpengerTokenDings,
} from "./dagpengerTokenDings";

export interface Dependencies {
  dagpengerTokenDings: Promise<DagpengerTokenDings>;
}

function createDependencies(): Dependencies {
  return {
    dagpengerTokenDings: createDagpengerTokenDings(),
  };
}

export default createDependencies;
