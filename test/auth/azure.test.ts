import express from 'express';
import bodyParser from 'body-parser';
import { getAzureAdToken } from '../../src/auth/azure';
import Mock = jest.Mock;
import jwt from 'jsonwebtoken';

function getAzureEndpointMockServer(spy: Mock, token: string) {
    const proxyServer = express();
    proxyServer.use(bodyParser());
    proxyServer.post('/token-endpoint', (req, res) => {
        spy(req.body);
        res.send({ access_token: token });
    });
    return proxyServer;
}
describe('getAzureAdToken', () => {
    it('kaller azure openid token endpoint', async () => {
        const PORT = 9876;
        const spy = jest.fn();
        const mockServer = getAzureEndpointMockServer(spy, 'token');
        const mock = mockServer.listen(PORT);
        try {
            await getAzureAdToken('test-scope', `http://localhost:${PORT}/token-endpoint`);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0][0].scope).toEqual('test-scope');
        } finally {
            mock.close();
        }
    });

    it('returnerer tokenet', async () => {
        const PORT = 9875;
        const mockServer = getAzureEndpointMockServer(jest.fn(), 'test-token');
        const mock = mockServer.listen(PORT);
        try {
            const token = await getAzureAdToken('test-scope2', `http://localhost:${PORT}/token-endpoint`);
            expect(token).toEqual('test-token');
        } finally {
            mock.close();
        }
    });

    it('cacher tokenet', async () => {
        const PORT = 9874;
        let count = 0;
        const spyFn = jest.fn(() => {
            count += 1;
        });

        jest.spyOn(jwt, 'decode').mockReturnValue({ exp: Date.now() });

        const mockServer = getAzureEndpointMockServer(spyFn, 'token-123');
        const mock = mockServer.listen(PORT);

        try {
            const token1 = await getAzureAdToken('test-scope-123', `http://localhost:${PORT}/token-endpoint`);
            const token2 = await getAzureAdToken('test-scope-123', `http://localhost:${PORT}/token-endpoint`);

            expect(token1).toEqual('token-123');
            expect(token1).toEqual(token2);
            expect(count).toEqual(1);
        } finally {
            mock.close();
            jest.restoreAllMocks();
        }
    });
});
