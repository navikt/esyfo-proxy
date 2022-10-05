import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import dagpenger from '../../src/api/dagpenger';

describe('dagpenger api', () => {
    it('kaller dagpenger-api med token-x i header', async () => {
        const dagpengerTokenDings = {
            exchangeIDPortenToken: jest.fn().mockReturnValue(Promise.resolve({ access_token: 'tokenX-123' })),
        };

        const proxyServer = express();
        proxyServer.get('/soknad', (req, res) => {
            if (
                req.header('Authorization') === 'Bearer tokenX-123' &&
                req.header('TokenXAuthorization') === 'Bearer tokenX-123'
            ) {
                res.status(200).send('ok');
            } else {
                res.status(400).end();
            }
        });
        const proxy = proxyServer.listen(6667);

        const app = express();
        app.use(cookieParser());
        app.use(dagpenger(dagpengerTokenDings, 'http://localhost:6667'));

        const response = await request(app).get('/dagpenger/soknad').set('Cookie', ['selvbetjening-idtoken=token123;']);

        expect(dagpengerTokenDings.exchangeIDPortenToken).toBeCalledWith('token123');
        expect(response.statusCode).toEqual(200);
        expect(response.text).toBe('ok');

        proxy.close();
    });
});
