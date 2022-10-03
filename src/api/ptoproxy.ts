import {FastifyInstance} from 'fastify';
import axios from 'axios';

const NAV_COOKIE_NAME = 'selvbetjening-idtoken'
const CONSUMER_ID_HEADER_NAME = 'Nav-Consumer-Id'
const CONSUMER_ID_HEADER_VALUE = 'paw:bakveientilarbeid'

function ptoProxy(fastify: FastifyInstance, options: any, done: any) {
  fastify.get('/oppfolging', async (req, reply) => {
    const token = req.cookies[NAV_COOKIE_NAME]
    const url = `${process.env.PTO_PROXY_URL}/veilarboppfolging/api/oppfolging`
    const { data } = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        [CONSUMER_ID_HEADER_NAME]: CONSUMER_ID_HEADER_VALUE
      }
    })
    reply.send(data);
  });
  done();
};

export default ptoProxy;
