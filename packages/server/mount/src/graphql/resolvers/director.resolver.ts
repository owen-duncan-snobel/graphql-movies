import prisma from "../../libs/prisma/client"

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
}
export default directorResolver