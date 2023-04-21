import { z } from "zod"
import prisma from "../../libs/prisma/client"
import { Context } from "./user.resolver"
import { createDirector } from "../services/director.service"
import { MovieSchema } from "./movie.resolver"
import { GraphQLError } from "graphql"

const IdSchema = z.coerce.number().positive()

const DirectorSchema = z.object({
  name: z.string(),
  movies: z.array(MovieSchema).optional()
})

export const directorResolver = {
  Query: {
    director: async (_: any, args: Record<string, any>) => {
      return await prisma.director.findFirst({
        where: {
          id: +args.id
        },
        include: {
          movies: true
        }
      })
    },
    directors: async (_: any, args: Record<string, any>) => {
      return await prisma.director.findMany({
        include: {
          movies: true
        }
      })
    },
  },
  Mutation: {
    createDirector: async (_: any, args: Record<string, any>, context: Context) => {
      if (!context || !context.user) throw new GraphQLError('Unauthorized access')
      const validateInputs = DirectorSchema.safeParse(args)
      if (!validateInputs.success) throw new GraphQLError(validateInputs.error.message)
      return await createDirector({ name: args.name, movies: args.movies })
    }
  }
}
export default directorResolver