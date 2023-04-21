import { makeExecutableSchema } from '@graphql-tools/schema'
import prisma from '../libs/prisma/client'
import { IResolvers } from '@graphql-tools/utils'
import typeDefs from './typeDefs'
import resolvers from './resolvers'


export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// model Director {
//   id        Int @id @default(autoincrement())
//   name      String
//   movies    Movie[]
// }