import { PrismaClient, Prisma } from '@prisma/client'
import { movies_db } from './movies_db'

const prisma = new PrismaClient()

async function main(){
  const movies = movies_db.movies.map(movie => {
    return {
      director: movie.director,
      title: movie.title,
      year: movie.year,
      plot: movie.plot,
      release_date: new Date(+movie.year, 0, 1)
    }
  })

  // create an object where the keys are the directors name and values are array of the movies they directed
  const director_movies: any = {}
  for (let movie of movies){
    const format_movie = {
      name: movie.title,
      description: movie.plot,
      release_date: new Date(+movie.year, 0, 1)
    }
    if (movie.director in director_movies){
      director_movies[movie.director] = [...director_movies[movie.director], format_movie]
    } else {
      director_movies[movie.director] = [format_movie]
    }
  }

  const directors_names = Object.keys(director_movies)

  const createDirectorsWithMovies = await prisma.$transaction(
    directors_names.map((name) => 
      prisma.director.create({
        data: {
          name,
          movies: {
            createMany: {
              data: director_movies[name]
            }
          }
        }, 
      })
    )
  )

  const createUser = await prisma.user.create({
    data: {
      email: 'test@viralnation.com',
      password: 'test',
      username: 'viral_nation',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
