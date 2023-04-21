import { z } from "zod"
import { GraphQLError } from "graphql"
import { createMovie, getMovie, getMovies } from "../services/movie.service"

const MovieSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(0).max(255),
  director_id: z.number().optional(),
  release_date: z.coerce.date().optional(),
})

const GetMovieSchema = z.number()

export const movieResolver = {
  Query: {
    movie: async (_: any, args: Record<string, any>) => {
      const validateInputs = GetMovieSchema.safeParse(+args.id)
      if (!validateInputs.success) throw new GraphQLError('Invalid movie id')
      // TODO add pagination, filtering, sorting
      return await getMovie(+args.id)
    },
    movies: async (_: any, args: Record<string, any>) => {
      // TODO add pagination, filtering, sorting
      return await getMovies()
    },
  },
  Mutation: {
    createMovie: async (_: any, {name, description, director_id, release_date}: Record<string, any>) => {
      const validateInputs = MovieSchema.safeParse({name, description, director_id, release_date})
      if (!validateInputs.success) throw new GraphQLError('Invalid inputs')
      return await createMovie(name, description, director_id, release_date)
    }
  }
}
export default movieResolver