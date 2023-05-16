import express from 'express';
import request from 'supertest';
import veilederApi from '../../../src/api/veileder';
import bodyParser from 'body-parser';

describe('veileder api', () => {
    describe('POST /besvarelse', () => {
        it('returnerer 401 hvis mangler bearerToken', async () => {
            const verifyAzureToken = () => Promise.resolve();
            const app = express();
            app.use(veilederApi(verifyAzureToken as any));

            await request(app).post('/veileder/besvarelse').expect(401, 'mangler bearer token');
        });

        it('returnerer 401 hvis verifisering kaster exception', async () => {
            const verifyAzureToken = () => Promise.reject();
            const app = express();
            app.use(veilederApi(verifyAzureToken as any));

            const response = await request(app).post('/veileder/besvarelse').set('authorization', 'token123');
            expect(response.statusCode).toEqual(401);
            expect(response.text).toEqual('kan ikke verifisere token');
        });

        it('returnerer 401 hvis verifisering feiler', async () => {
            const verifyAzureToken = () => Promise.resolve({ errorType: 'UNKNOWN_JOSE_ERROR' });
            const app = express();
            app.use(veilederApi(verifyAzureToken as any));

            const response = await request(app).post('/veileder/besvarelse').set('authorization', 'token123');
            expect(response.statusCode).toEqual(401);
            expect(response.text).toEqual('feil ved verifisering av token');
        });

        it('returnerer 400 hvis fnr mangler i body', async () => {
            const verifyAzureToken = () => Promise.resolve({ payload: { aud: 'test' } });
            const app = express();
            app.use(bodyParser());
            app.use(veilederApi(verifyAzureToken as any, 'test'));

            const response = await request(app).post('/veileder/besvarelse').set('authorization', 'token123');

            expect(response.statusCode).toEqual(400);
        });
    });
});
