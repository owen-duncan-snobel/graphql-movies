import { Prisma } from '@prisma/client'
import { prismaMock } from '../../libs/prisma/singleton'

describe('Movie Service Tests', () => {
  it('should return a list of movies', async () => {
    const director = {
      id: 1,
      name: 'Lana Wachowski',
    }

    const createDirector = await prismaMock.director.create.mockResolvedValue(director)

    const movie = {
        id: 1,
        name: 'The Matrix',
        release_date: new Date('1999-03-31'),
        director_id: 1,
        created_at: new Date('2021-01-01'),
        updated_at: new Date('2021-01-01'),
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        director: {
          id: 1,
          name: 'Lana Wachowski',
        }
      }

    const createMovies = prismaMock.movie.create.mockResolvedValue(movie)
    
    // expect(movies).toHaveLength(1)
    // expect(movies[0].name).toBe('The Matrix')
  })

  it('should return a list of movies with a director', async () => {
    prismaMock.movie.findMany.mockResolvedValue([
      // {
      //   id: 1,
      //   name: 'The Matrix',
      //   release_date: new Date('1999-03-31'),
      //   director_id: 1,
      //   created_at: new Date('2021-01-01'),
      //   updated_at: new Date('2021-01-01'),
      //   description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
      //   director: {
      //     id: 1,
      //     name: 'Lana Wachowski',
      //     created_at: new Date('2021-01-01'),
      //     updated_at: new Date('2021-01-01'),
      //   },
      // },
    ])

    // const movies = await prismaMock.movie.findMany()
    // expect(movies).toHaveLength(1)
    // expect(movies[0].name).toBe('The Matrix')
    // expect(movies[0].director).toEqual({
    //   id: 1,
    //   name: 'Lana Wachowski',
    //   created_at: new Date('2021-01-01'),
    //   updated_at: new Date('2021-01-01'),
    // })
  })
})