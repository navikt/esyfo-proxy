export interface BeregnedePerioder {
    harAktivArbeidssokerperiode: 'INGEN_DATA' | 'N/A' | 'Ja' | 'Nei';
    aktivPeriodeStart: 'INGEN_DATA' | 'N/A' | 'Ingen aktive perioder' | string;
    antallDagerSidenSisteArbeidssokerperiode: number | 'Ikke avsluttet' | 'INGEN_DATA' | 'N/A';
    antallUkerSidenSisteArbeidssokerperiode: number | 'Ikke avsluttet' | 'INGEN_DATA' | 'N/A';
    antallUkerMellomSisteArbeidssokerperioder: number | 'INGEN_DATA' | 'N/A' | 'Første periode';
}

export interface DpInnsynSoknad {
    søknadId: string;
    skjemaKode: string;
    tittel: string;
    journalpostId: string;
    søknadsType: string;
    kanal: string;
    datoInnsendt: string;
    vedlegg: {
        skjemaNummer: string;
        navn: string;
        status: string; // INNVILGET | AVSLÅTT | STANS | ENDRING
    }[];
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

export interface BrukerregistreringData {
    registrering: Brukerregistrering;
}
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
