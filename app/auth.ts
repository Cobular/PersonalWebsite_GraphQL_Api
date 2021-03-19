import { AuthChecker } from "type-graphql"

export const secretKeyAuthChecker: AuthChecker<ContextType> = ({ context }) => {
  // Check that the authorization header matches the secret key'

  console.log({ context: context })
  console.log({ env: process.env.SECRET_KEY })
  if (context.auth === process.env.SECRET_KEY) {
    console.log("auth passed")
    return true
  }
  console.log("auth failed")
  return false
}
