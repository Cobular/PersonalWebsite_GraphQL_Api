import { MiddlewareFn } from "type-graphql"
import { CacheScope } from "apollo-cache-control"

export function CacheControl(maxAge: number = 60): MiddlewareFn {
  return ({ info: { cacheControl } }, next) => {
    cacheControl.setCacheHint({ maxAge, scope: CacheScope.Public })
    return next()
  }
}
