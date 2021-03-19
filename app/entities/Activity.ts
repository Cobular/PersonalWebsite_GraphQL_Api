import { Field, ObjectType, registerEnumType } from "type-graphql"

@ObjectType({ description: "The activity I am currently engaged in." })
export class Activity {
  @Field(_type => ActivityType)
  activityType: ActivityType

  @Field()
  updatedTime: Date
}

export enum ActivityType {
  GAME = "GAME",
  SCHOOL = "SCHOOL",
  CHILL = "CHILL",
  UNKNOWN = "UNKNOWN",
}

registerEnumType(ActivityType, {
  name: "ActivityType",
  description: "The type of activity",
})
