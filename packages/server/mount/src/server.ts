import express, { Request, Response } from 'express'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import http from 'http'
import helmet from 'helmet'
import redisClient from './libs/redis/redis'
import { schema } from './graphql'

const PORT = process.env.PORT || 4000

const app = express()
const httpServer = http.createServer(app)

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
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
  app.use("/graphql", expressMiddleware(server))

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