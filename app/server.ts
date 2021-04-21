import { ApolloServer } from "apollo-server-express"
import Express from "express"
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import { secretKeyAuthChecker } from "./auth"
import responseCachePlugin from "apollo-server-plugin-response-cache";


// resolvers
import { ActivityResolver } from "./resolvers/Activity"
import { NowPlayingResolver } from "./resolvers/NowPlaying"

async function main() {
  const schema = await buildSchema({
    resolvers: [ActivityResolver, NowPlayingResolver],
    emitSchemaFile: true,
    validate: false,
    authChecker: secretKeyAuthChecker,
  })

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const ctx: ContextType = {
        auth: req.headers.authorization,
      }
      return ctx
    },
    plugins: [responseCachePlugin()],
    cacheControl: true,
    playground: {
      // @ts-ignore
      shareEnabled: true,
    }
  })
  const app = Express()
  server.applyMiddleware({ app })
  app.listen({ port: 3333 }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`,
    ),
  )
}

main().catch(error => {
  console.log(error, "error")
})
