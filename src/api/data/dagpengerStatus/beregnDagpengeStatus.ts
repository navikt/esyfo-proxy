import {
    BeregnedePerioder,
    BrukerInfoData,
    BrukerregistreringData,
    DagpengeStatus,
    DpInnsynPaabegyntSoknad,
    DpInnsynSoknad,
    Vedtak,
} from './typer';

export const sorterEtterNyesteDatoInnsendt = (a: DpInnsynSoknad, b: DpInnsynSoknad) =>
    new Date(b.datoInnsendt).getTime() - new Date(a.datoInnsendt).getTime();

export const sorterEtterNyesteVedtak = (a: Vedtak, b: Vedtak) =>
    new Date(b.datoFattet).getTime() - new Date(a.datoFattet).getTime();

function beregnDagpengeStatus({
    brukerInfoData,
    registreringData,
    paabegynteSoknader,
    innsendteSoknader,
    dagpengeVedtak,
    arbeidssokerperioder,
}: {
    brukerInfoData: BrukerInfoData;
    registreringData: BrukerregistreringData | null;
    paabegynteSoknader: DpInnsynPaabegyntSoknad[];
    innsendteSoknader: DpInnsynSoknad[];
    dagpengeVedtak: Vedtak[];
    arbeidssokerperioder: BeregnedePerioder;
}): DagpengeStatus {
    const { rettighetsgruppe } = brukerInfoData;
    const { aktivPeriodeStart, harAktivArbeidssokerperiode } = arbeidssokerperioder;
    const erIaktivPeriode = harAktivArbeidssokerperiode === 'Ja';
    const harOpprettetDato = registreringData?.registrering?.opprettetDato;

    if (rettighetsgruppe === 'DAGP') {
        return 'mottar';
    }

    if (!harOpprettetDato && !erIaktivPeriode) {
        return 'ukjent';
    }

    const registreringsDato = harOpprettetDato
        ? new Date(registreringData?.registrering!.opprettetDato)
        : new Date(aktivPeriodeStart);
    const sistInnsendteSoknad = innsendteSoknader.sort(sorterEtterNyesteDatoInnsendt)[0];
    const sisteDagpengevedtak = dagpengeVedtak.sort(sorterEtterNyesteVedtak)[0];

    const erVedtakNyereEnnSoknad =
        sisteDagpengevedtak &&
        sistInnsendteSoknad &&
        new Date(sisteDagpengevedtak.datoFattet).getTime() > new Date(sistInnsendteSoknad.datoInnsendt).getTime();

    if (erVedtakNyereEnnSoknad) {
        const vedtakErNyereEnnSisteRegistreringsdato =
            new Date(sisteDagpengevedtak.datoFattet).getTime() > registreringsDato.getTime();
        if (sisteDagpengevedtak && sisteDagpengevedtak.status === 'AVSLÅTT' && vedtakErNyereEnnSisteRegistreringsdato) {
            return 'avslag';
        }

        const erVedtakAvsluttet = sisteDagpengevedtak.tilDato
            ? new Date(sisteDagpengevedtak.tilDato).getTime() < new Date().getTime()
            : false;

        if (sisteDagpengevedtak && sisteDagpengevedtak.status === 'INNVILGET' && !erVedtakAvsluttet) {
            return vedtakErNyereEnnSisteRegistreringsdato ? 'innvilget' : 'tidligere-innvilget';
        }

        if (erVedtakAvsluttet) {
            return 'stanset';
        }
    }

    const sistPaabegynteSoknad = paabegynteSoknader.sort(
        (a: DpInnsynPaabegyntSoknad, b: DpInnsynPaabegyntSoknad) =>
            new Date(a.sistEndret).getTime() - new Date(b.sistEndret).getTime()
    )[0];

    const harPaabegyntEtterInnsendt =
        sistPaabegynteSoknad &&
        sistInnsendteSoknad &&
        new Date(sistPaabegynteSoknad.sistEndret).getTime() > new Date(sistInnsendteSoknad?.datoInnsendt).getTime();

    if (harPaabegyntEtterInnsendt) {
        return 'soktogpaabegynt';
    }

    if (sistInnsendteSoknad) {
        return 'sokt';
    }

    if (sistPaabegynteSoknad) {
        return 'paabegynt';
    }

    return 'ukjent';
}

export default beregnDagpengeStatus;
