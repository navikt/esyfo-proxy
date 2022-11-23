import { DagpengeStatus, Vedtak } from './typer';
import { dagerFraDato } from './beregnArbeidssokerPerioder';

const sorterEtterNyesteVedtak = (a: Vedtak, b: Vedtak) =>
    new Date(b.datoFattet).getTime() - new Date(a.datoFattet).getTime();

function beregnAntallDagerSidenDagpengerStanset(dagpengerStatus: DagpengeStatus, dagpengeVedtak: Vedtak[]) {
    const sisteDagpengevedtak = dagpengeVedtak
        .filter((vedtak) => vedtak.status === 'INNVILGET')
        .sort(sorterEtterNyesteVedtak)[0];

    const antallDagerSidenDagpengerStanset =
        sisteDagpengevedtak?.tilDato && dagpengerStatus === 'stanset'
            ? dagerFraDato(new Date(sisteDagpengevedtak.tilDato))
            : undefined;

    return antallDagerSidenDagpengerStanset;
}

export default beregnAntallDagerSidenDagpengerStanset;
