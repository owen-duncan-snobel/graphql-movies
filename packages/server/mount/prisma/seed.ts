import { PrismaClient, Prisma } from '@prisma/client'
import { movies_db } from './movies_db'
const prisma = new PrismaClient()

async function main(){
  const movies = movies_db.movies.map(movie => {
    return {
      director: movie.director,
      title: movie.title,
      year: movie.year,
      plot: movie.plot
    }
  })
  
  const directors: Prisma.DirectorCreateInput[] = movies_db.movies.map(movie => {
    return {
      name: movie.director
    }
  })

  // const movies: Prisma.MovieCreateInput[] = [
  //   {

  //   }
  // ]

  const insertMovies = await prisma.movie.createMany({
      data: [
        ...movies
      ],
      skipDuplicates: true
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
