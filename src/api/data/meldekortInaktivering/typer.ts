export type MeldekortType =
    | 'ORDINAER'
    | 'ERSTATNING'
    | 'RETUR'
    | 'ELEKTRONISK'
    | 'AAP'
    | 'ORDINAER_MANUELL'
    | 'MASKINELT_OPPDATERT'
    | 'MANUELL_ARENA'
    | 'KORRIGERT_ELEKTRONISK';

export interface MeldekortDto {
    erArbeidssokerNestePeriode: boolean;
    periodeFra: string;
    periodeTil: string;
    meldekorttype: MeldekortType;
    eventOpprettet: string;
}
