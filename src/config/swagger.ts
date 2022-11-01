import swaggerJsdoc from 'swagger-jsdoc';
import config from './';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        basePath: '/aia-backend',
        info: {
            title: 'AIA Backend',
            description: `Proxy-api for aia (Arbeidsflate for innlogget arbeidssøker) frontend.\n\nGithub repo: [https://github.com/navikt/aia-backend](https://github.com/navikt/aia-backend)\n\nSlack: [#po-arbeid-paw](https://nav-it.slack.com/archives/CK0RPQ5QB)`,
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: config.NAV_COOKIE_NAME,
                },
            },
            schemas: {
                Unauthorized: {
                    description:
                        'Uautentisert forespørsel. Må være autentisert med selvbetjening-cookie. Token kan være gått ut.',
                },
                Ok: {
                    description: 'Vellykket forespørsel.',
                },
                Error: {
                    description: 'Noe gikk galt',
                },
                MeldeperiodeInn: {
                    required: ['fra', 'kanKortSendes', 'kortKanSendesFra', 'periodeKode', 'til'],
                    type: 'object',
                    properties: {
                        fra: { type: 'string', format: 'date' },
                        til: { type: 'string', format: 'date' },
                        kortKanSendesFra: { type: 'string', format: 'date' },
                        kanKortSendes: { type: 'boolean' },
                        periodeKode: { type: 'string' },
                    },
                },
                PersonStatus: {
                    required: ['id'],
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        statusArbeidsoker: { type: 'string' },
                        statusYtelse: { type: 'string' },
                    },
                },
                Meldekort: {
                    required: ['korrigerbart', 'kortStatus', 'kortType', 'meldegruppe', 'meldekortId', 'meldeperiode'],
                    type: 'object',
                    properties: {
                        meldekortId: { type: 'integer', format: 'int64' },
                        kortType: {
                            type: 'string',
                            enum: ['01', '03', '04', '05', '06', '07', '08', '09', '10'],
                        },
                        meldeperiode: { $ref: '#/components/schemas/MeldeperiodeInn' },
                        meldegruppe: {
                            type: 'string',
                            enum: ['ATTF', 'DAGP', 'INDIV', 'ARBS', 'FY', 'NULL'],
                        },
                        kortStatus: {
                            type: 'string',
                            enum: [
                                'OPPRE',
                                'SENDT',
                                'SLETT',
                                'REGIS',
                                'FMOPP',
                                'FUOPP',
                                'KLAR',
                                'KAND',
                                'IKKE',
                                'OVERM',
                                'NYKTR',
                                'FERDI',
                                'FEIL',
                                'VENTE',
                                'OPPF',
                                'UBEHA',
                            ],
                        },
                        bruttoBelop: { type: 'number', format: 'float' },
                        erForskuddsPeriode: { type: 'boolean' },
                        mottattDato: { type: 'string', format: 'date' },
                        korrigerbart: { type: 'boolean' },
                    },
                },
                Fravaer: {
                    required: ['fraDato', 'tilDato', 'type'],
                    type: 'object',
                    properties: {
                        fraDato: { type: 'string', format: 'date' },
                        tilDato: { type: 'string', format: 'date' },
                        type: { type: 'string' },
                    },
                },
                Person: {
                    required: ['etterregistrerteMeldekort', 'maalformkode', 'meldeform', 'meldekort'],
                    type: 'object',
                    properties: {
                        maalformkode: { type: 'string' },
                        meldeform: { type: 'string' },
                        meldekort: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Meldekort' },
                        },
                        etterregistrerteMeldekort: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Meldekort' },
                        },
                        fravaer: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Fravaer' },
                        },
                        id: { type: 'string' },
                        antallGjenstaaendeFeriedager: {
                            type: 'integer',
                            format: 'int32',
                        },
                    },
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },
    apis: ['./src/api/*.ts'],
};

export default swaggerJsdoc(options);
