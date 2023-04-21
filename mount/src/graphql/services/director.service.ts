import { Prisma } from "@prisma/client"
import prisma from "../../libs/prisma/client"
import { CreateMovieInputs } from "../resolvers/movie.resolver"
import { GraphQLError } from "graphql"


export const createDirector = async ({
  name, 
  movies
}: {
  name: string,
  movies?: CreateMovieInputs[]
}) => {
  try {
    const data: any = {}
    if (name) data.name = name
    if (movies) data.movies = {
      createMany: {
        data: movies.map(movie => {
          if (movie.release_date) movie.release_date = new Date(movie.release_date as unknown as string)
          return {
            ...movie,
          }
        })
      }
    }
    return await prisma.director.create({
      data, 
      include: {
        movies: true
      }
    })
  } catch (err){
    console.log(err)
    if (err)
    throw new GraphQLError('Unable to create director')
  }
}