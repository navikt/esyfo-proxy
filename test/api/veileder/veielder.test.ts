import express from 'express';
import request from 'supertest';
import veilederApi from '../../../src/api/veileder';

describe('veileder api', () => {
    describe('POST /veileder/besvarelse', () => {
        it('proxy kaller besvarelse', async () => {
            const proxyServer = express();
            const spy = jest.fn();

            proxyServer.post('/api/v1/veileder/besvarelse', (req, res) => {
                spy();
                res.status(200).end();
            });

            const port = 6169;
            const proxy = proxyServer.listen(port);

            const app = express();
            app.use(veilederApi({} as any, `http://localhost:${port}`));

            try {
                await request(app).post('/veileder/besvarelse').expect(200);
                expect(spy).toHaveBeenCalled();
            } finally {
                proxy.close();
            }
        });
    });
});
