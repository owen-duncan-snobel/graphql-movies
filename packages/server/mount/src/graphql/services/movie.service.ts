import { GraphQLError } from 'graphql'
import prisma from '../../libs/prisma/client'
import { GetMovieInputs, GetMoviesInputs, UpdateMovieInputs } from '../resolvers/movie.resolver'
import { Prisma } from '@prisma/client'
import { orderByMovies } from '../utils'

export const getMovie = async (args: GetMovieInputs) => {
  try {
    const andWhere: Prisma.MovieWhereInput[] = []
    if (args.filter?.id) andWhere.push({ id: args.filter.id })
    if (args.filter?.name) andWhere.push({ name: {
        contains: args.filter.name,
        mode: 'insensitive'
    }})  
    if (args.filter?.description) andWhere.push({ description: {
        contains: args.filter.description,
        mode: 'insensitive'
    }})
    if (args.filter?.director_id) andWhere.push({ director_id: args.filter.director_id })
    return await prisma.movie.findFirst({
      where: {
        AND: andWhere
      }
    })
  } catch (err: any){
    if (err.code === 'P2025') throw new GraphQLError('Movie does not exist')
    throw new GraphQLError('Unable to get movie')
  }
}

export const getMovies = async (args: GetMoviesInputs) => {
  try {
    const andWhere: Prisma.MovieWhereInput[] = []
    if (args.filter?.id) andWhere.push({ id: args.filter.id })
    if (args.filter?.name) andWhere.push({ name: {
        contains: args.filter.name,
        mode: 'insensitive'
    }})
    if (args.filter?.description) andWhere.push({ description: {
      contains: args.filter.description,
      mode: 'insensitive'
    }})
    const orderBy = (args.orderBy ? orderByMovies(args.orderBy) : [])
    return await prisma.movie.findMany({
      where: {
        AND: andWhere
      },
      orderBy,
      skip: args.offset,
      take: args.limit
    })
  } catch(err: any){
    throw new GraphQLError('Unable to get movies')
  }
}

export const createMovie = async ({
  name,
  description,
  director_id,
  release_date
}: {
  name: string,
  description: string,
  director_id: number,
  release_date: string
}) => {
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

export const deleteMovieById = async (id: number) => {
  try {
    return await prisma.movie.delete({
      where: {
        id
      }
    })
  } catch (err: any){
    if (err.code === 'P2025') throw new GraphQLError('Movie does not exist')
    throw new GraphQLError('Unable to delete movie')
  }
}

export const updateMovie = async ({ id, name, description, director_id, release_date}: UpdateMovieInputs) => {
  try {
    const data: Prisma.MovieUpdateInput = {}
    if (name) data.name = name
    if (description) description = description
    if (release_date) release_date = new Date(release_date)
    if (director_id) data.director = {
      update: {
        id: director_id
      }
    }
    const updatedMovie = await prisma.movie.update({
      where: {
        id
      },
      data,
    })
    return updatedMovie
  } catch (err: any){
    console.log(err)
    if (err.code === 'P2025') throw new GraphQLError('Movie does not exist')
    throw new GraphQLError('Unable to update movie')
  }
}