import {
    beregnMeldekortStatus,
    grupperMeldekort,
} from '../../../../src/api/data/meldekortInaktivering/beregnMeldekortStatus';
import { MeldekortDto } from '../../../../src/api/data/meldekortInaktivering/typer';

describe('beregnMeldekortStatus', () => {
    describe('grupperMeldekort', () => {
        it('sorterer etter nyeste periodeFra', () => {
            const meldekort: MeldekortDto[] = [
                {
                    erArbeidssokerNestePeriode: true,
                    periodeFra: '2022-10-01',
                    periodeTil: '2022-11-01',
                    meldekorttype: 'KORRIGERT_ELEKTRONISK',
                    eventOpprettet: '2022-11-02',
                },
                {
                    erArbeidssokerNestePeriode: true,
                    periodeFra: '2022-11-01',
                    periodeTil: '2022-11-02',
                    meldekorttype: 'KORRIGERT_ELEKTRONISK',
                    eventOpprettet: '2022-11-03',
                },
            ];

            const resultat = grupperMeldekort(meldekort, new Date('2022-09-28'));

            expect(resultat[0][0].periodeFra).toEqual('2022-11-01');
        });

        it('filtrerer ut gamle perioder', () => {
            const meldekort: MeldekortDto[] = [
                {
                    erArbeidssokerNestePeriode: true,
                    periodeFra: '2022-07-01',
                    periodeTil: '2022-08-01',
                    meldekorttype: 'KORRIGERT_ELEKTRONISK',
                    eventOpprettet: '2022-11-02',
                },
            ];

            expect(grupperMeldekort(meldekort)).toEqual([]);
        });

        it('grupperer meldekort i perioder', () => {
            const meldekort: MeldekortDto[] = [
                {
                    erArbeidssokerNestePeriode: true,
                    periodeFra: '2022-10-01',
                    periodeTil: '2022-11-01',
                    meldekorttype: 'KORRIGERT_ELEKTRONISK',
                    eventOpprettet: '2022-11-02',
                },
                {
                    erArbeidssokerNestePeriode: true,
                    periodeFra: '2022-10-01',
                    periodeTil: '2022-11-01',
                    meldekorttype: 'ELEKTRONISK',
                    eventOpprettet: '2022-11-04',
                },
                {
                    erArbeidssokerNestePeriode: true,
                    periodeFra: '2022-11-01',
                    periodeTil: '2022-11-02',
                    meldekorttype: 'KORRIGERT_ELEKTRONISK',
                    eventOpprettet: '2022-11-03',
                },
            ];

            const resultat = grupperMeldekort(meldekort, new Date('2022-09-01'));

            expect(resultat).toEqual([
                [
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-11-01',
                        periodeTil: '2022-11-02',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-03',
                    },
                ],
                [
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-10-01',
                        periodeTil: '2022-11-01',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-02',
                    },
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-10-01',
                        periodeTil: '2022-11-01',
                        meldekorttype: 'ELEKTRONISK',
                        eventOpprettet: '2022-11-04',
                    },
                ],
            ]);
        });
    });
    describe('status', () => {
        it('returnerer INGEN_INNSENDT når ingen meldekort', () => {
            expect(beregnMeldekortStatus([])).toEqual('INGEN_INNSENDT');
        });

        it('returnerer SVART_NEI hvis noen meldekort er svart nei på', () => {
            const meldekortGruppe: MeldekortDto[][] = [
                [
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-11-01',
                        periodeTil: '2022-11-02',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-03',
                    },
                ],
                [
                    {
                        erArbeidssokerNestePeriode: false,
                        periodeFra: '2022-10-01',
                        periodeTil: '2022-11-01',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-02',
                    },
                ],
            ];

            expect(beregnMeldekortStatus(meldekortGruppe)).toEqual('SVART_NEI');
        });

        it('returnerer MANGLER_INNSENDING hvis periodeFra ikke matcher neste periodeTil', () => {
            const meldekortGruppe: MeldekortDto[][] = [
                [
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-11-01',
                        periodeTil: '2022-11-02',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-03',
                    },
                ],
                [
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-10-01',
                        periodeTil: '2022-11-01',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-02',
                    },
                ],
                [
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-08-01',
                        periodeTil: '2022-09-01',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-02',
                    },
                ],
            ];
            expect(beregnMeldekortStatus(meldekortGruppe)).toEqual('MANGLER_INNSENDING');
        });

        it('returnerer FOR_SEN_INNSENDING hvis eventOpprettet >= 8 dager etter periodeTil', () => {
            const meldekortGruppe: MeldekortDto[][] = [
                [
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-11-01',
                        periodeTil: '2022-11-02',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-03',
                    },
                ],
                [
                    {
                        erArbeidssokerNestePeriode: true,
                        periodeFra: '2022-10-01',
                        periodeTil: '2022-11-01',
                        meldekorttype: 'KORRIGERT_ELEKTRONISK',
                        eventOpprettet: '2022-11-09',
                    },
                ],
            ];
            expect(beregnMeldekortStatus(meldekortGruppe)).toEqual('FOR_SEN_INNSENDING');
        });
    });
});
