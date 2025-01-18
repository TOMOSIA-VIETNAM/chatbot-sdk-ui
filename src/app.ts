import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';

const startServer = async () => {
  const fastify = Fastify({
    logger: true
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
  });

  fastify.get('/chatbot/:projectId', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.type('text/html').sendFile('interface.html')
  })

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server started on 0.0.0.0:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
