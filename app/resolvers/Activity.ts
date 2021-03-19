import { Activity, ActivityType } from "../entities/Activity"
import { Mutation, Query, Resolver, Arg, Authorized } from "type-graphql"

@Resolver()
export class ActivityResolver {
  private currentActivity: ActivityType = ActivityType.UNKNOWN
  private updatedTime: Date = new Date(Date.now())

  @Query((_returns) => Activity)
  async activity(): Promise<Activity> {
    return {
      activityType: this.currentActivity,
      updatedTime: this.updatedTime,
    }
  }

  @Mutation((_returns) => Boolean, {
    description: "Sets the current activity. Must be authorized.",
  })
  @Authorized()
  async setActivity(
    @Arg("activity", (_type) => ActivityType) activity: ActivityType,
  ): Promise<Boolean> {
    this.currentActivity = activity
    this.updatedTime = new Date(Date.now())
    return true
  }
}
