import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { logger } from './utils/logger';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { authMiddleware } from './middleware/auth';
import { rateLimiter } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  // Middleware
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  }));
  
  app.use(express.json());
  app.use(rateLimiter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
  });

  await server.start();

  // GraphQL endpoint
  app.use(
    '/graphql',
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: createContext,
    })
  );

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    logger.info(`📍 Health check at http://localhost:${PORT}/health`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});