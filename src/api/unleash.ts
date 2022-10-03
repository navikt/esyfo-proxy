import {FastifyInstance, FastifyRequest} from 'fastify';

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

type UnleashRequest = FastifyRequest<{
  Querystring: { feature: string }
}>

function unleashRoutes(fastify: FastifyInstance, options: any, done: any) {
  fastify.get('/unleash', (req: UnleashRequest, reply) => {
    const features = ensureArray(req.query.feature).reduce((acc, key) => {
      return {
        ...acc,
        [key]: isEnabled(key)
      };
    }, {});

    reply.send(features);
  });

  done();
}

export default unleashRoutes;
