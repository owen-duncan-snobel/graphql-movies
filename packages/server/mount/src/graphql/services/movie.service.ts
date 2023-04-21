import { GraphQLError } from 'graphql'
import prisma from '../../libs/prisma/client'

export const getMovie = async (id: number) => {
  try {
    return await prisma.movie.findFirst({
      where: {
        id
      }
    })
  } catch (err: any){
    throw new GraphQLError('Unable to get movie')
  }
}

export const getMovies = async () => {
  try {
    return await prisma.movie.findMany()
  } catch(err: any){
    throw new GraphQLError('Unable to get movies')
  }
}

export const createMovie = async (name: string, description: string, director_id: number, release_date: string) => {
  try {
    return await prisma.movie.create({
      data: {
        name,
        description,
        release_date: new Date(release_date),
        director_id
      }
    })
  } catch (err: any){
    console.log(err)
    if (err.code === 'P2002') throw new GraphQLError('Movie already exists')
    if (err.code === 'P2025') throw new GraphQLError('Director does not exist')
    throw new GraphQLError('Unable to create movie')
  }
}