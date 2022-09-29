import {FastifyInstance} from 'fastify';

function healthRoutes(fastify: FastifyInstance, options: any, done: any) {
  fastify.get('/internal/isAlive', (req, reply) => {
    reply.send('ALIVE');
  });
  fastify.get('/internal/isReady', (req, reply) => {
    reply.send('READY');
  });

  done();
}


export default healthRoutes;
