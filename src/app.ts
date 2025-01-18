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

  fastify.get('/api/v1/chat_interface/:projectId', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.type('application/json').send({
      data: {
        project: {
          flag_collect_information: 1,
        },
        chatbot_name: "Chatbot",
        chatbot_picture: "https://mgpt.tomosia.com.vn/assets/images/logos/tms-hello-word.png",
        chatbot_picture_active: 1,
        theme_color: "#000",
        initial_message: "Welcome to the chat!",
        suggest_message: "How can I help you?\nWhat is your name?\nWhat is your question?",
        brand_name: "My Brand",
        brand_link: "https://mybrand.com",
      },
    });
  });

  fastify.post('/api/v1/chat-stream', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('Content-Type', 'application/octet-stream')
    reply.send("Hello World")
  });

  fastify.post('/api/v1/guest-users', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.type('application/json').send({
      message: "OKE"
    });
  });

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server started on 0.0.0.0:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
