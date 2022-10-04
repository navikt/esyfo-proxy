import {Request, Router} from 'express';
const { initialize, isEnabled } = require('unleash-client');

initialize({
  appName: 'aia-backend',
  url: process.env.UNLEASH_API_URL,
});

function ensureArray(features?: string | Array<string>) {
  if (!features) {
    return [];
  }

  if (Array.isArray(features)) {
    return features;
  }

  return [features];
}

type FeatureQuery = {
  feature: string
}

function unleashRoutes() {
  const router = Router();

  router.get('/unleash', (req: Request<{},{},{}, FeatureQuery>, res) => {
    const features = ensureArray(req.query.feature).reduce((acc, key) => {
      return {
        ...acc,
        [key]: isEnabled(key)
      };
    }, {});

    res.send(features);
  });

  return router;
}

export default unleashRoutes;
