import prisma from "../../libs/prisma/client"

export const movieResolver = {
  Query: {
    movie: async (_: any, args: Record<string, any>) => {
      return await prisma.movie.findFirst({
        where: {
          id: +args.id
        }
      })
    },
    movies: async (_: any, args: Record<string, any>) => {
      return await prisma.movie.findMany()
    },
  },
  Mutation: {
    
  }
}
export default movieResolver