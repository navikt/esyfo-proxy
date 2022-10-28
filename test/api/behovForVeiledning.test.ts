import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import behovForVeiledning from '../../src/api/behovForVeiledning';
import bodyParser from 'body-parser';

jest.mock('../../src/auth/tokenDings', () => {
    return {
        getSubjectFromToken: jest.fn().mockReturnValue('test-ident'),
    };
});
describe('behovForVeiledning API', () => {
    let app: any;

    beforeEach(() => {
        app = express();
        app.use(cookieParser());
        app.use(bodyParser.json());
    });

    describe('GET', () => {
        it('returnerer {oppfolging, dato, dialogId}', async () => {
            const behovRepository = {
                lagreBehov: jest.fn(),
                hentBehov: jest.fn().mockReturnValue(
                    Promise.resolve({
                        oppfolging: 'KLARE_SEG_SELV',
                        created_at: 'test-dato',
                        dialog_id: 'dialog-id',
                    })
                ),
            };

            app.use(behovForVeiledning(behovRepository));

            const response = await request(app)
                .get('/behov-for-veiledning')
                .set('Cookie', ['selvbetjening-idtoken=token123;']);

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({ oppfolging: 'KLARE_SEG_SELV', dato: 'test-dato', dialogId: 'dialog-id' });
        });

        it('returnerer 204 når ingen treff i db', async () => {
            const behovRepository = {
                lagreBehov: jest.fn(),
                hentBehov: jest.fn().mockReturnValue(Promise.resolve(null)),
            };

            app.use(behovForVeiledning(behovRepository));

            const response = await request(app)
                .get('/behov-for-veiledning')
                .set('Cookie', ['selvbetjening-idtoken=token123;']);

            expect(response.statusCode).toEqual(204);
        });
    });

    describe('POST', () => {
        it('lagrer og returnerer {oppfolging, dato, dialogId}', async () => {
            const behovRepository = {
                hentBehov: jest.fn(),
                lagreBehov: jest.fn().mockReturnValue(
                    Promise.resolve({
                        oppfolging: 'KLARE_SEG_SELV',
                        created_at: 'test-dato',
                        dialog_id: 'dialog-id',
                    })
                ),
            };

            app.use(behovForVeiledning(behovRepository));

            const response = await request(app)
                .post('/behov-for-veiledning')
                .send({ oppfolging: 'KLARE_SEG_SELV', dialogId: 'dialog-id-1' })
                .set('Cookie', ['selvbetjening-idtoken=token123;']);

            expect(response.statusCode).toEqual(201);
            expect(behovRepository.lagreBehov).toHaveBeenCalledWith({
                bruker: 'test-ident',
                oppfolging: 'KLARE_SEG_SELV',
                dialogId: 'dialog-id-1',
            });
            expect(response.body).toEqual({ oppfolging: 'KLARE_SEG_SELV', dato: 'test-dato', dialogId: 'dialog-id' });
        });
    });
});
