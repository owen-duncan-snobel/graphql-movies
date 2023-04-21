import { IResolvers } from "@graphql-tools/utils";
import userResolver from './user.resolver'
import movieResolver from './movie.resolver'
import directorResolver from './director.resolver'


const resolvers: IResolvers = {
  Query: {
    ...userResolver.Query,
    ...movieResolver.Query,
    ...directorResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...movieResolver.Mutation,
    ...directorResolver.Mutation
  }
}

export default resolvers