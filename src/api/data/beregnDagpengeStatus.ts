/*
  avhengigheter:
 - når registrert => dato "" fra registreringsData
 - har påbegynte søknader => []
 - har innsendte søknader => []
 - har dagpengevedtak => []
 - rettighetsgruppe => "" fra brukerInfo
 */

export interface BeregnedePerioder {
    harAktivArbeidssokerperiode: 'INGEN_DATA' | 'N/A' | 'Ja' | 'Nei';
    aktivPeriodeStart: 'INGEN_DATA' | 'N/A' | string | 'Ingen aktive perioder';
    antallDagerSidenSisteArbeidssokerperiode: number | 'Ikke avsluttet' | 'INGEN_DATA' | 'N/A';
    antallUkerSidenSisteArbeidssokerperiode: number | 'Ikke avsluttet' | 'INGEN_DATA' | 'N/A';
    antallUkerMellomSisteArbeidssokerperioder: number | 'INGEN_DATA' | 'N/A' | 'Første periode';
}

interface DpInnsynSoknad {
    søknadId: string;
    skjemaKode: string;
    tittel: string;
    journalpostId: string;
    søknadsType: string;
    kanal: string;
    datoInnsendt: string;
    vedlegg: [
        {
            skjemaNummer: string;
            navn: string;
            status: string; // INNVILGET | AVSLÅTT | STANS | ENDRING
        }
    ];
}

export interface Vedtak {
    vedtakId: string;
    fagsakId: string;
    status: string;
    datoFattet: string;
    fraDato: string;
    tilDato?: string;
}

export interface DpInnsynPaabegyntSoknad {
    tittel: string;
    behandlingsId: string;
    sistEndret: string;
    erNySøknadsdialog?: boolean;
    endreLenke?: string;
}

export enum RegistreringType {
    REAKTIVERING = 'REAKTIVERING',
    SPERRET = 'SPERRET',
    ALLEREDE_REGISTRERT = 'ALLEREDE_REGISTRERT',
    SYKMELDT_REGISTRERING = 'SYKMELDT_REGISTRERING',
    ORDINAER_REGISTRERING = 'ORDINAER_REGISTRERING',
}

export type RegistreringTypeOrIngenVerdi = RegistreringType | 'INGEN_VERDI';
export interface BrukerInfoData {
    erSykmeldtMedArbeidsgiver: boolean;
    registreringType?: RegistreringTypeOrIngenVerdi;
    geografiskTilknytning?: string;
    rettighetsgruppe: string;
    alder: number;
}

export enum DinSituasjonSvar {
    MISTET_JOBBEN = 'MISTET_JOBBEN',
    ALDRI_HATT_JOBB = 'ALDRI_HATT_JOBB',
    HAR_SAGT_OPP = 'HAR_SAGT_OPP',
    VIL_BYTTE_JOBB = 'VIL_BYTTE_JOBB',
    ER_PERMITTERT = 'ER_PERMITTERT',
    USIKKER_JOBBSITUASJON = 'USIKKER_JOBBSITUASJON',
    JOBB_OVER_2_AAR = 'JOBB_OVER_2_AAR',
    VIL_FORTSETTE_I_JOBB = 'VIL_FORTSETTE_I_JOBB',
    AKKURAT_FULLFORT_UTDANNING = 'AKKURAT_FULLFORT_UTDANNING',
    DELTIDSJOBB_VIL_MER = 'DELTIDSJOBB_VIL_MER',
    INGEN_SVAR = 'INGEN_SVAR',
    INGEN_VERDI = 'INGEN_VERDI',
}

export enum FremtidigSituasjonSvar {
    SAMME_ARBEIDSGIVER = 'SAMME_ARBEIDSGIVER',
    SAMME_ARBEIDSGIVER_NY_STILLING = 'SAMME_ARBEIDSGIVER_NY_STILLING',
    NY_ARBEIDSGIVER = 'NY_ARBEIDSGIVER',
    USIKKER = 'USIKKER',
    INGEN_PASSER = 'INGEN_PASSER',
}

export interface Besvarelse {
    dinSituasjon: DinSituasjonSvar | null;
    fremtidigSituasjon: FremtidigSituasjonSvar;
    sisteStilling: string | null;
    tilbakeIArbeid: string | null;
    andreForhold: string | null;
    helseHinder: string | null;
    utdanning: string | null;
    utdanningBestatt: string | null;
    utdanningGodkjent: string | null;
}

export enum ForeslattInnsatsgruppe {
    STANDARD_INNSATS = 'STANDARD_INNSATS',
    SITUASJONSBESTEMT_INNSATS = 'SITUASJONSBESTEMT_INNSATS',
    BEHOV_FOR_ARBEIDSEVNEVURDERING = 'BEHOV_FOR_ARBEIDSEVNEVURDERING',
}

export interface Profilering {
    innsatsgruppe: ForeslattInnsatsgruppe;
}

export interface Svar {
    sporsmalId: string;
    sporsmal: string;
    svar: string;
}

export interface SisteStilling {
    konseptId: number;
    label: string;
    styrk08: string;
}

export interface Brukerregistrering {
    opprettetDato: string;
    manueltRegistrertAv: object | null;
    besvarelse: Besvarelse;
    teksterForBesvarelse: Array<Svar> | null;
    profilering?: Profilering;
    sisteStilling?: SisteStilling | undefined | null;
}

interface BrukerregistreringData {
    registrering: Brukerregistrering;
}

export const sorterEtterNyesteDatoInnsendt = (a: DpInnsynSoknad, b: DpInnsynSoknad) =>
    new Date(b.datoInnsendt).getTime() - new Date(a.datoInnsendt).getTime();

export const sorterEtterNyesteVedtak = (a: Vedtak, b: Vedtak) =>
    new Date(b.datoFattet).getTime() - new Date(a.datoFattet).getTime();
export type DagpengeStatus =
    | 'paabegynt'
    | 'sokt'
    | 'mottar'
    | 'reaktivert'
    | 'ukjent'
    | 'avslag'
    | 'innvilget'
    | 'soktogpaabegynt'
    | 'stanset'
    | 'tidligere-innvilget';

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
