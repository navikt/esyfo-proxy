import swaggerJsdoc from 'swagger-jsdoc';
import config from './';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'AIA Backend',
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
