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

export type MeldekortStatus = 'INGEN_INNSENDT' | 'SVART_NEI' | 'MANGLER_INNSENDING' | 'FOR_SEN_INNSENDING' | 'N/A';
