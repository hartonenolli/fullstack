const { ApolloServer } = require('@apollo/server')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const jwt = require('jsonwebtoken')

const User = require('./models/user')

const getCurrentUser = async (req) => {
  const auth = req.headers.authorization
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), process.env.JWT_SECRET
    )
    return await User.findById(decodedToken.id)
  }
}

const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer({ schema: makeExecutableSchema({ typeDefs, resolvers }) }, wsServer)
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const currentUser = await getCurrentUser(req)
        return { currentUser }
      },
    }),
  )

  httpServer.listen(port, () =>
    console.log(`Server is now running on http://localhost:${port}`),
  )
}

module.exports = startServer
 