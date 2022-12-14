import express, { Request, Response, RequestHandler } from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import { mockDeep } from 'jest-mock-extended';
import { AutomatiskReaktiveringRepository } from '../../../src/db/automatiskReaktiveringRepository';
import automatiskReaktiveringRoutes from '../../../src/api/reaktivering/automatiskReaktivering';

describe('automatisk reaktivering api', () => {
    describe('POST /azure/automatisk-reaktivering', () => {
        it('gir 401 når auth feiler', async () => {
            const app = express();
            app.use(bodyParser.json());

            const authMiddleware: RequestHandler = (req: Request, res: Response, _) => {
                res.status(401).end();
            };
            const repository = mockDeep<AutomatiskReaktiveringRepository>();

            app.use(automatiskReaktiveringRoutes(repository, authMiddleware));
            const response = await request(app).post('/azure/automatisk-reaktivering');

            expect(response.statusCode).toEqual(401);
        });

        it('gir 400 hvis poster uten fnr', async () => {
            const app = express();
            app.use(bodyParser.json());

            const authMiddleware: RequestHandler = (_, __, next) => {
                next();
            };

            const repository = mockDeep<AutomatiskReaktiveringRepository>();

            app.use(automatiskReaktiveringRoutes(repository, authMiddleware));
            const response = await request(app).post('/azure/automatisk-reaktivering');

            expect(response.statusCode).toEqual(400);
        });

        it('lagrer bruker i automatiskReaktivering', async () => {
            const app = express();
            app.use(bodyParser.json());

            const authMiddleware: RequestHandler = (_, __, next) => {
                next();
            };

            const repository = mockDeep<AutomatiskReaktiveringRepository>();
            repository.lagre.mockResolvedValue({
                id: 42,
                bruker_id: 'fnr-123',
                created_at: new Date('2022-12-12T11:30:28.603Z'),
            });

            app.use(automatiskReaktiveringRoutes(repository, authMiddleware));

            const response = await request(app).post('/azure/automatisk-reaktivering').send({ fnr: 'fnr-123' });

            expect(response.statusCode).toEqual(201);
            expect(response.body).toEqual({
                id: 42,
                bruker_id: 'fnr-123',
                created_at: '2022-12-12T11:30:28.603Z',
            });
        });
    });
});
