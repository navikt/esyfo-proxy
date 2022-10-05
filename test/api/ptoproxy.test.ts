import express from 'express';
import request from 'supertest';
import ptoproxy from '../../src/api/ptoproxy';
import cookieParser from 'cookie-parser';

describe('ptoproxy api', () => {
    it('gir 401 hvis request uten selvbetjening-id cookie', (done) => {
        const app = express();
        app.use(ptoproxy('http://localhost:6666'));

        request(app).get('/oppfolging').expect(401, done);
    });

    it('kaller pto-proxty med token i header', async () => {
        const proxyServer = express();
        proxyServer.get('/veilarboppfolging/api/oppfolging', (req, res) => {
            if (req.headers['authorization'] === 'Bearer token123') {
                res.status(200).send('ok');
            } else {
                res.status(400).end();
            }
        });
        const proxy = proxyServer.listen(6666);
        const app = express();
        app.use(cookieParser());
        app.use(ptoproxy('http://localhost:6666'));

        const response = await request(app).get('/oppfolging').set('Cookie', ['selvbetjening-idtoken=token123;']);

        expect(response.statusCode).toEqual(200);
        expect(response.text).toBe('ok');

        proxy.close();
    });
});
