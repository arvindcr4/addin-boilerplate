import { GraphQLError } from 'graphql';
import { AuthService } from '../services/authService';
import { Context } from '../context';
import { logger } from '../utils/logger';

export const authResolvers = {
  Query: {
    currentUser: async (_: any, __: any, { user }: Context) => {
      if (!user) {
        return null;
      }

      const userData = AuthService.getUserById(user.id);
      if (!userData) {
        return null;
      }

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt.toISOString(),
      };
    },

    health: () => 'OK',
  },

  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      try {
        return await AuthService.login(email, password);
      } catch (error) {
        logger.error('Login error:', error);
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
    },

    signup: async (_: any, { email, password, name }: { email: string; password: string; name: string }) => {
      try {
        // Basic validation
        if (!email || !password || !name) {
          throw new Error('All fields are required');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        if (!email.includes('@')) {
          throw new Error('Invalid email format');
        }

        return await AuthService.signup(email, password, name);
      } catch (error: any) {
        logger.error('Signup error:', error);
        throw new GraphQLError(error.message || 'Signup failed', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
    },

    refreshToken: async (_: any, { refreshToken }: { refreshToken: string }) => {
      try {
        return await AuthService.refreshToken(refreshToken);
      } catch (error: any) {
        logger.error('Refresh token error:', error);
        throw new GraphQLError(error.message || 'Invalid refresh token', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
    },

    logout: async (_: any, __: any, { user }: Context) => {
      // In a real implementation, you might want to invalidate the token
      // For now, just return true
      return true;
    },
  },
};