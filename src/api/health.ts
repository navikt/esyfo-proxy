import {Router} from 'express';

function healthRoutes() {
  const router = Router();

  router.get('/internal/isAlive', (req, res) => {
    res.send('ALIVE');
  });
  router.get('/internal/isReady', (req, res) => {
    res.send('READY');
  });

  return router;
}


export default healthRoutes;
