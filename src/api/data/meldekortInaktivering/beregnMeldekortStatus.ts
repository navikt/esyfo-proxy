import { MeldekortDto, MeldekortStatus } from './typer';

const sorterEtterNyestePeriodeFra = (a: MeldekortDto, b: MeldekortDto) => {
    return new Date(b.periodeFra).getTime() - new Date(a.periodeFra).getTime();
};

const filtrerUtEldreEnn = (dato: Date) => (meldekort: MeldekortDto) => {
    return new Date(meldekort.periodeTil) > dato;
};

const ATTE_UKER_I_MS = 8 * 7 * 24 * 60 * 60 * 1000;

export function grupperMeldekort(meldekort: MeldekortDto[], filtrerPaaDato?: Date): MeldekortDto[][] {
    const dato = filtrerPaaDato ?? new Date(Date.now() - ATTE_UKER_I_MS);

    return meldekort
        .sort(sorterEtterNyestePeriodeFra)
        .filter(filtrerUtEldreEnn(dato))
        .reduce((acc, m) => {
            const sisteMeldekort = acc.pop();

            if (Array.isArray(sisteMeldekort)) {
                if (sisteMeldekort[0].periodeFra === m.periodeFra && sisteMeldekort[0].periodeTil === m.periodeTil) {
                    return [...acc, sisteMeldekort.concat(m)];
                }
                return [...acc, sisteMeldekort, [m]];
            }

            return [...acc, [m]];
        }, [] as MeldekortDto[][]);
}

function svartNei(grupperteMeldekort: MeldekortDto[][]) {
    return grupperteMeldekort.some((meldekortGruppe) =>
        meldekortGruppe.some((meldekort) => !meldekort.erArbeidssokerNestePeriode)
    );
}

function manglerInnsending(grupperteMeldekort: MeldekortDto[][]) {
    return grupperteMeldekort.some((meldekortGruppe, index) => {
        const forrigeMeldekortGruppe = grupperteMeldekort[index + 1];
        if (forrigeMeldekortGruppe) {
            return meldekortGruppe[0].periodeFra !== forrigeMeldekortGruppe[0].periodeTil;
        }
        return false;
    });
}

function plussDager(dato: Date, antallDager: number) {
    const kopi = new Date(dato);
    kopi.setDate(kopi.getDate() + antallDager);
    return kopi;
}

function forSenInnlevering(grupperteMeldekort: MeldekortDto[][]) {
    return grupperteMeldekort.some((meldekortGruppe) => {
        return meldekortGruppe.some((meldekort) => {
            return (
                plussDager(new Date(meldekort.periodeTil), 8).getTime() <= new Date(meldekort.eventOpprettet).getTime()
            );
        });
    });
}

export function beregnMeldekortStatus(grupperteMeldekort: MeldekortDto[][]): MeldekortStatus {
    if (grupperteMeldekort.length === 0) {
        return 'INGEN_INNSENDT';
    }

    if (svartNei(grupperteMeldekort)) {
        return 'SVART_NEI';
    }

    if (manglerInnsending(grupperteMeldekort)) {
        return 'MANGLER_INNSENDING';
    }

    if (forSenInnlevering(grupperteMeldekort)) {
        return 'FOR_SEN_INNSENDING';
    }

    return 'N/A';
}
