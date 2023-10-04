import ukerFraDato from '@alheimsins/uker-fra-dato';
import { BeregnedePerioder } from './typer';

export function dagerFraDato(from: Date, to?: Date): number {
    const todate = to || new Date();
    const start = new Date(from.toISOString().substr(0, 10));
    const end = new Date(todate.toISOString().substr(0, 10));
    const millis = end.getTime() - start.getTime();
    const days = millis / 3600000 / 24;
    return Math.floor(days);
}

export interface Periode {
    fraOgMedDato: string;
    tilOgMedDato?: string | null;
}

interface Props {
    arbeidssokerperioder: [] | Periode[];
}

export function sorterArbeidssokerperioderSisteForst(a: Periode, b: Periode) {
    return new Date(b.fraOgMedDato).getTime() - new Date(a.fraOgMedDato).getTime();
}

function harAktivArbeidssokerperiode(perioder: Periode[]) {
    const sistePeriode = perioder[0];
    return sistePeriode.tilOgMedDato === null || sistePeriode.tilOgMedDato === undefined;
}

function beregnAntallDagerSidenSisteArbeidssokerperiode(dato: string | null) {
    return dagerFraDato(dato ? new Date(dato) : new Date());
}

function beregnAntallUkerSidenSisteArbeidssokerperiode(dato: string | null) {
    return ukerFraDato(dato ? new Date(dato) : new Date());
}

function beregnAntallUkerMellomSisteArbeidssokerperioder(perioder: Periode[]) {
    const sistePeriode = perioder[0];
    const nestSistePeriode = perioder[1];
    return ukerFraDato(new Date(nestSistePeriode?.tilOgMedDato || '2020-01-01'), new Date(sistePeriode.fraOgMedDato));
}

function beregnArbeidssokerperioder(props: Props | null | undefined): BeregnedePerioder {
    const { arbeidssokerperioder } = props ? props : { arbeidssokerperioder: null };

    if (arbeidssokerperioder === null) {
        return {
            harAktivArbeidssokerperiode: 'INGEN_DATA',
            aktivPeriodeStart: 'INGEN_DATA',
            antallDagerSidenSisteArbeidssokerperiode: 'INGEN_DATA',
            antallUkerSidenSisteArbeidssokerperiode: 'INGEN_DATA',
            antallUkerMellomSisteArbeidssokerperioder: 'INGEN_DATA',
        };
    }

    if (arbeidssokerperioder.length === 0) {
        return {
            harAktivArbeidssokerperiode: 'N/A',
            aktivPeriodeStart: 'N/A',
            antallDagerSidenSisteArbeidssokerperiode: 'N/A',
            antallUkerSidenSisteArbeidssokerperiode: 'N/A',
            antallUkerMellomSisteArbeidssokerperioder: 'N/A',
        };
    }

    arbeidssokerperioder.sort(sorterArbeidssokerperioderSisteForst);

    const aktivArbeidssokerperiode = harAktivArbeidssokerperiode(arbeidssokerperioder);
    const sluttDatoSistePeriode = arbeidssokerperioder[0].tilOgMedDato ?? null;
    const harMerEnnEnPeriode = arbeidssokerperioder.length > 1;

    return {
        harAktivArbeidssokerperiode: aktivArbeidssokerperiode ? 'Ja' : 'Nei',
        aktivPeriodeStart: aktivArbeidssokerperiode
            ? new Date(arbeidssokerperioder[0].fraOgMedDato).toISOString().substring(0, 10)
            : 'Ingen aktive perioder',
        antallDagerSidenSisteArbeidssokerperiode: aktivArbeidssokerperiode
            ? 'Ikke avsluttet'
            : beregnAntallDagerSidenSisteArbeidssokerperiode(sluttDatoSistePeriode),
        antallUkerSidenSisteArbeidssokerperiode: aktivArbeidssokerperiode
            ? 'Ikke avsluttet'
            : beregnAntallUkerSidenSisteArbeidssokerperiode(sluttDatoSistePeriode),
        antallUkerMellomSisteArbeidssokerperioder: harMerEnnEnPeriode
            ? beregnAntallUkerMellomSisteArbeidssokerperioder(arbeidssokerperioder)
            : 'Første periode',
    };
}

export default beregnArbeidssokerperioder;
