import {Router} from 'express';

function healthRoutes() {
  const router = Router();

  router.get('/internal/isAlive', (_, res) => {
    res.send('ALIVE');
  });
  router.get('/internal/isReady', (_, res) => {
    res.send('READY');
  });

  return router;
}


export default healthRoutes;
