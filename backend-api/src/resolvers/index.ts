import { authResolvers } from './authResolvers';
import { aiResolvers } from './aiResolvers';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...aiResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...aiResolvers.Mutation,
  },
};