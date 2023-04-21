import express, { Request, Response } from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import http from 'http'
import helmet from 'helmet'
import redisClient from './libs/redis/redis'
import { schema } from './graphql'
import { getUserWithToken } from './graphql/services/user.service'
import KeyV from 'keyv'
import { KeyvAdapter } from '@apollo/utils.keyvadapter'

const PORT = process.env.PORT || 4000
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

const app = express()
const httpServer = http.createServer(app)

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],  
    cache: new KeyvAdapter(new KeyV(REDIS_URL, { client: redisClient }))
  })

  await server.start()

  // middleware
  app.use(cors())
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
  }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use("/graphql", expressMiddleware(server, {
    context: async ({req, res}: {req: Request, res: Response}) => {
      const token = req.headers.authorization || ''
      const user = await getUserWithToken(token)
      return { user }
     }
  }))

  app.get('/health', async (req: Request, res: Response) => {
    return res.status(200).json({
      status: 'SUCCESS',
      message: 'The server is healthy!'
    })
  })

  app.listen(PORT, () => {
    console.log(`🚀 ready at http://localhost:${PORT}/graphql`)
  })
}

startServer()