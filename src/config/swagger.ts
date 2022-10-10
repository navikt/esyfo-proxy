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
