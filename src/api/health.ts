import { Router } from 'express';
import { createMetrics } from './metrics';

function healthRoutes() {
    const router = Router();
    const register = createMetrics();

    router.get('/internal/isAlive', (_, res) => {
        res.send('ALIVE');
    });
    router.get('/internal/isReady', (_, res) => {
        res.send('READY');
    });
    router.get('/internal/prometheus', async (_, res) => {
        res.setHeader('Content-type', register.contentType);
        res.send(await register.metrics());
    });

    return router;
}

export default healthRoutes;
