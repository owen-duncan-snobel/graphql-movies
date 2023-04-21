import { z } from "zod"
import { GraphQLError } from "graphql"
import { createMovie, getMovie, getMovies, deleteMovieById, updateMovie } from "../services/movie.service"
import { Context } from "./user.resolver"

const IdSchema = z.coerce.number().positive()

const MovieSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(0).max(255),
  director_id: z.number().optional(),
  release_date: z.coerce.date().optional(),
})

const FilterInputs = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  director_id: z.number().optional(),
}).partial()

const GetMovieSchema = z.object({
  filter: FilterInputs,
}).refine((data) => data.filter && Object.keys(data.filter).length > 0)

const GetMoviesSchema = z.object({
  filter: FilterInputs.optional(),
  orderBy: z.object({}).optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})

const UpdateMovieSchema = z.object({
  id: IdSchema,
  name: z.string().min(3).max(255).optional(),
  description: z.string().min(0).max(255).optional(),
  director_id: z.number().optional(),
  release_date: z.coerce.date().optional(),
})

export type GetMovieInputs = z.infer<typeof GetMovieSchema>
export type GetMoviesInputs = z.infer<typeof GetMoviesSchema>
export type UpdateMovieInputs = z.infer<typeof UpdateMovieSchema>

export const movieResolver = {
  Query: {
    movie: async (_: any, args: any) => {
      const validateInputs = GetMovieSchema.safeParse(args)
      if (!validateInputs.success) throw new GraphQLError('Invalid inputs')
      return await getMovie(args)
    },
    movies: async (_: any, args: any) => {
      const validateInputs = GetMoviesSchema.safeParse(args)
      if (!validateInputs.success) throw new GraphQLError('Invalid inputs')
      return await getMovies(args)
    },
  },
  Mutation: {
    createMovie: async (_: any, {name, description, director_id, release_date}: Record<string, any>) => {
      const validateInputs = MovieSchema.safeParse({name, description, director_id, release_date})
      if (!validateInputs.success) throw new GraphQLError('Invalid inputs')
      return await createMovie(name, description, director_id, release_date)
    },
    deleteMovieById: async (_: any, { id }: Record<string, any>, context: Context) => {
      if (!context || !context.user) throw new GraphQLError('Unauthorized access')
      const validateInputs = IdSchema.safeParse(+id)
      if (!validateInputs.success) throw new GraphQLError('Invalid movie id')
      await deleteMovieById(+id)
      return 'Movie successfully deleted'
    },
    updateMovieById: async (_: any, { id, name, description, director_id, release_date }: Record<string, any>, context: Context) => {
      if (!context || !context.user) throw new GraphQLError('Unauthorized access')
      const validateInputs = UpdateMovieSchema.safeParse({ id: +id, name, description, director_id, release_date})
      if (!validateInputs.success) throw new GraphQLError('Invalid inputs')
      return await updateMovie({ id: +id, name, description, director_id, release_date })
    }
  }
}
export default movieResolver