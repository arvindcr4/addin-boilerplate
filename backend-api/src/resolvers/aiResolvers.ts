import { GraphQLError } from 'graphql';
import { AIService } from '../services/aiService';
import { Context } from '../context';
import { logger } from '../utils/logger';

// Helper to check authentication
function requireAuth(user: any) {
  if (!user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}

export const aiResolvers = {
  Query: {},

  Mutation: {
    analyzeText: async (_: any, { input }: any, { user }: Context) => {
      requireAuth(user);

      try {
        return await AIService.analyzeText(input);
      } catch (error: any) {
        logger.error('Analyze text error:', error);
        throw new GraphQLError(error.message || 'Analysis failed', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    askQuestion: async (
      _: any, 
      { documentText, question }: { documentText: string; question: string }, 
      { user }: Context
    ) => {
      requireAuth(user);

      try {
        if (!question || question.trim().length === 0) {
          throw new Error('Question cannot be empty');
        }

        return await AIService.askQuestion(documentText, question);
      } catch (error: any) {
        logger.error('Ask question error:', error);
        throw new GraphQLError(error.message || 'Failed to answer question', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    draftClause: async (
      _: any,
      { clauseType, context }: { clauseType: string; context: string },
      { user }: Context
    ) => {
      requireAuth(user);

      try {
        if (!clauseType || clauseType.trim().length === 0) {
          throw new Error('Clause type is required');
        }

        return await AIService.draftClause(clauseType, context);
      } catch (error: any) {
        logger.error('Draft clause error:', error);
        throw new GraphQLError(error.message || 'Failed to draft clause', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    improveText: async (
      _: any,
      { text, instruction }: { text: string; instruction: string },
      { user }: Context
    ) => {
      requireAuth(user);

      try {
        if (!text || text.trim().length === 0) {
          throw new Error('Text cannot be empty');
        }

        if (!instruction || instruction.trim().length === 0) {
          throw new Error('Instruction is required');
        }

        return await AIService.improveText(text, instruction);
      } catch (error: any) {
        logger.error('Improve text error:', error);
        throw new GraphQLError(error.message || 'Failed to improve text', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    generalReview: async (
      _: any,
      { documentText }: { documentText: string },
      { user }: Context
    ) => {
      requireAuth(user);

      try {
        if (!documentText || documentText.trim().length === 0) {
          throw new Error('Document text cannot be empty');
        }

        return await AIService.generalReview(documentText);
      } catch (error: any) {
        logger.error('General review error:', error);
        throw new GraphQLError(error.message || 'Review failed', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
  },
};