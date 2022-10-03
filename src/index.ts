import F from 'fastify';
import healhApi from './api/health';

const PORT = 3000;

const fastify = F({ logger: true });
fastify.register(healhApi)


const startServer = async () => {
  try {
    console.log(`Starting server...`);
    await fastify.listen({port: PORT as number, host: '0.0.0.0'});
  } catch(err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();

process.on('SIGTERM', async () => {
  try {
    await fastify.close();
    fastify.log.info('Server closed...')
  } catch (err) {
    fastify.log.error(err)
  }
});
