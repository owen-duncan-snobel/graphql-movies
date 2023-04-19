import { PrismaClient, Prisma } from '@prisma/client'
import { movies_db } from './movies_db'
import { format } from 'date-fns'

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

  //   id            Int @id @default(autoincrement())
  // name          String
  // description   String
  // director      Director  @relation(fields: [director_id], references: [id])
  // director_id   Int
  // release_date  DateTime 
  // created_at    DateTime @default(now())
  // updated_at    DateTime @default(now())

  // create an object where the keys are the directors name and values are array of the movies they directed
  const director_movies: any = {}
  for (let movie of movies){
    if (movie.director in director_movies){
      director_movies[movie.director] = [...director_movies[movie.director], movie]
    } else {
      director_movies[movie.director] = [movie]
    }
  }


  //const directors_names = Object.keys(director_movies)


  const createDirectors = await prisma.director.createMany({
    data: [
      ...movies.map(movie => {
        return {
          name: movie.director,
        }
      })
    ]
  })

  console.log(createDirectors)



  // const directors: Prisma.DirectorCreateInput[] = movies.map(movie => {
  //   return {
  //     name: movie.director,
  //   }
  // })

  // const insertMovies = await prisma.movie.createMany({
  //     data: [
  //       ...movies
  //     ],
  //     skipDuplicates: true
  //   })
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
