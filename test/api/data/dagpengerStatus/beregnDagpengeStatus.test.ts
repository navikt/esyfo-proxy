import {
    BeregnedePerioder,
    DinSituasjonSvar,
    FremtidigSituasjonSvar,
} from '../../../../src/api/data/dagpengerStatus/typer';
import beregnDagpengeStatus from '../../../../src/api/data/dagpengerStatus/beregnDagpengeStatus';

const iDag = new Date();
const brukerInfoData = {
    rettighetsgruppe: 'IYT',
    geografiskTilknytning: '110302',
    alder: 42,
    erSykmeldtMedArbeidsgiver: false,
};
const registreringData = {
    registrering: {
        opprettetDato: iDag.toISOString(),
        manueltRegistrertAv: null,
        besvarelse: {
            dinSituasjon: DinSituasjonSvar.MISTET_JOBBEN,
            fremtidigSituasjon: FremtidigSituasjonSvar.INGEN_PASSER,
            sisteStilling: '',
            tilbakeIArbeid: '',
            andreForhold: '',
            helseHinder: '',
            utdanning: '',
            utdanningBestatt: '',
            utdanningGodkjent: '',
        },
        teksterForBesvarelse: [],
    },
};

const arbeidssokerperioder: BeregnedePerioder = {
    harAktivArbeidssokerperiode: 'INGEN_DATA',
    aktivPeriodeStart: 'INGEN_DATA',
    antallDagerSidenSisteArbeidssokerperiode: 'INGEN_DATA',
    antallUkerSidenSisteArbeidssokerperiode: 'INGEN_DATA',
    antallUkerMellomSisteArbeidssokerperioder: 'INGEN_DATA',
};

function plussDager(dato: Date, antallDager: number) {
    const kopi = new Date(dato);
    kopi.setDate(kopi.getDate() + antallDager);
    return kopi;
}

const soknad = [
    {
        søknadId: '2',
        skjemaKode: 'NAV 04-01.03',
        tittel: 'Søknad om dagpenger (ikke permittert)',
        journalpostId: '11',
        søknadsType: 'NySøknad',
        kanal: 'Digital',
        datoInnsendt: '2021-08-21T10:29:09.655',
        vedlegg: [
            {
                skjemaNummer: '123',
                navn: 'navn',
                status: 'LastetOpp',
            },
        ],
    },
    {
        søknadId: '3',
        skjemaKode: 'NAV 04-01.03',
        tittel: 'Søknad om dagpenger (ikke permittert)',
        journalpostId: '12',
        søknadsType: 'NySøknad',
        kanal: 'Digital',
        datoInnsendt: '2021-08-21T10:29:09.655',
        vedlegg: [
            {
                skjemaNummer: '123',
                navn: 'navn',
                status: 'LastetOpp',
            },
        ],
    },
];

describe('Tester funksjonen beregnDagpengeStatus', () => {
    test('returnerer "mottar" når bruker mottar dagpenger', () => {
        return expect(
            beregnDagpengeStatus({
                brukerInfoData: {
                    ...brukerInfoData,
                    rettighetsgruppe: 'DAGP',
                },
                registreringData,
                arbeidssokerperioder,
                paabegynteSoknader: [],
                innsendteSoknader: [],
                dagpengeVedtak: [],
            })
        ).toBe('mottar');
    });

    test('returnerer "ukjent" hvis ingen registreringsdato og ingen arbeidssøkerperioder', () => {
        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData: {
                    ...registreringData,
                    registrering: {
                        ...registreringData.registrering,
                        opprettetDato: '',
                    },
                },
                arbeidssokerperioder,
                paabegynteSoknader: [],
                innsendteSoknader: [],
                dagpengeVedtak: [],
            })
        ).toBe('ukjent');
    });

    test('returnerer "ukjent" når ikke eksisterer påbegynte søknader, innsendte søknader eller vedtak', () => {
        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData,
                arbeidssokerperioder,
                paabegynteSoknader: [],
                innsendteSoknader: [],
                dagpengeVedtak: [],
            })
        ).toBe('ukjent');
    });

    test('returnerer "avslag" når vedtak etter nyeste søknad og vedtaket har status "AVSLÅTT" ', () => {
        const soknader = [...soknad];
        soknader[0].datoInnsendt = plussDager(iDag, 10).toISOString();

        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData,
                arbeidssokerperioder,
                paabegynteSoknader: [],
                innsendteSoknader: soknader,
                dagpengeVedtak: [
                    {
                        vedtakId: '2',
                        fagsakId: 'arenaId',
                        status: 'AVSLÅTT',
                        datoFattet: plussDager(iDag, 11).toISOString(),
                        fraDato: '2021-11-19T10:31:18.176',
                    },
                ],
            })
        ).toBe('avslag');
    });

    test('returnerer "innvilget" når vedtak etter nyeste søknad og vedtaket har status "INNVILGET" ', () => {
        const soknader = [...soknad];
        soknader[0].datoInnsendt = plussDager(iDag, 10).toISOString();

        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData,
                arbeidssokerperioder,
                paabegynteSoknader: [],
                innsendteSoknader: soknader,
                dagpengeVedtak: [
                    {
                        vedtakId: '2',
                        fagsakId: 'arenaId',
                        status: 'INNVILGET',
                        datoFattet: plussDager(iDag, 11).toISOString(),
                        fraDato: '2021-11-19T10:31:18.176',
                    },
                ],
            })
        ).toBe('innvilget');
    });

    test('returnerer "tidligere-innvilget" når vedtak etter nyeste søknad og vedtaket har status "INNVILGET" og nyregistrert ', () => {
        const soknader = [...soknad];
        soknader[0].datoInnsendt = plussDager(iDag, 10).toISOString();

        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData: {
                    ...registreringData,
                    registrering: {
                        ...registreringData.registrering,
                        opprettetDato: plussDager(iDag, 12).toISOString(),
                    },
                },
                arbeidssokerperioder,
                paabegynteSoknader: [],
                innsendteSoknader: soknader,
                dagpengeVedtak: [
                    {
                        vedtakId: '2',
                        fagsakId: 'arenaId',
                        status: 'INNVILGET',
                        datoFattet: plussDager(iDag, 11).toISOString(),
                        fraDato: '2021-11-19T10:31:18.176',
                    },
                ],
            })
        ).toBe('tidligere-innvilget');
    });

    test('returnerer "stanset" når vedtakets tilDato har vært', () => {
        const soknader = [...soknad];
        soknader[0].datoInnsendt = plussDager(iDag, 10).toISOString();

        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData,
                arbeidssokerperioder,
                paabegynteSoknader: [],
                innsendteSoknader: soknader,
                dagpengeVedtak: [
                    {
                        vedtakId: '2',
                        fagsakId: 'arenaId',
                        status: 'INNVILGET',
                        datoFattet: plussDager(iDag, 11).toISOString(),
                        fraDato: '2021-11-19T10:31:18.176',
                        tilDato: plussDager(iDag, -1).toISOString(),
                    },
                ],
            })
        ).toBe('stanset');
    });

    test('returnerer "paabegynt" når det eksisterer påbegynte søknader', () => {
        const soknader = [
            {
                tittel: 'Søknad om dagpenger (ikke permittert)',
                behandlingsId: '10010WQX9',
                sistEndret: plussDager(iDag, 1).toISOString(),
            },
        ];

        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData,
                arbeidssokerperioder,
                paabegynteSoknader: soknader,
                innsendteSoknader: [],
                dagpengeVedtak: [],
            })
        ).toBe('paabegynt');
    });

    test('returnerer "paabegynt" når det eksisterer påbegynte søknader også for de som er registrert før ny løsning', () => {
        const soknader = [
            {
                tittel: 'Søknad om dagpenger (ikke permittert)',
                behandlingsId: '10010WQX9',
                sistEndret: plussDager(iDag, 1).toISOString(),
            },
        ];

        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData: {
                    ...registreringData,
                    registrering: {
                        ...registreringData.registrering,
                        opprettetDato: '',
                    },
                },
                arbeidssokerperioder: {
                    harAktivArbeidssokerperiode: 'Ja',
                    aktivPeriodeStart: '2018-06-26',
                    antallDagerSidenSisteArbeidssokerperiode: 'INGEN_DATA',
                    antallUkerSidenSisteArbeidssokerperiode: 'INGEN_DATA',
                    antallUkerMellomSisteArbeidssokerperioder: 'INGEN_DATA',
                },
                paabegynteSoknader: soknader,
                innsendteSoknader: [],
                dagpengeVedtak: [],
            })
        ).toBe('paabegynt');
    });

    test('returnerer "sokt" når det eksisterer innsendte søknader og ingen vedtak etter søknadsdato', () => {
        const soknader = [...soknad];
        soknader[0].datoInnsendt = plussDager(iDag, 1).toISOString();

        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData,
                arbeidssokerperioder,
                paabegynteSoknader: [],
                innsendteSoknader: soknader,
                dagpengeVedtak: [
                    {
                        vedtakId: '2',
                        fagsakId: 'arenaId',
                        status: 'INNVILGET',
                        datoFattet: plussDager(iDag, -10).toISOString(),
                        fraDato: '2021-11-19T10:31:18.176',
                        tilDato: 'null',
                    },
                ],
            })
        ).toBe('sokt');
    });

    test('returnerer "soktogpaabegynt" når siste påbeynte soknad er nyere enn siste innsendte søknad ', () => {
        const soknader = [...soknad];
        soknader[0].datoInnsendt = plussDager(iDag, 1).toISOString();
        const paabegyntSoknad = [
            {
                tittel: 'Søknad om dagpenger (ikke permittert)',
                behandlingsId: '10010WQX9',
                sistEndret: plussDager(iDag, 2).toISOString(),
            },
        ];

        return expect(
            beregnDagpengeStatus({
                brukerInfoData,
                registreringData,
                arbeidssokerperioder,
                paabegynteSoknader: paabegyntSoknad,
                innsendteSoknader: soknader,
                dagpengeVedtak: [],
            })
        ).toBe('soktogpaabegynt');
    });
});
