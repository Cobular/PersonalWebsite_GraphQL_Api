import { ObjectType, Field, Int, createUnionType } from "type-graphql"
import { IsUrl } from "class-validator"
import { isEpisode, isTrack } from "../guards"

@ObjectType()
export class Artist {
  @Field()
  name: string
  @Field()
  link: string
}

@ObjectType()
export class Media {
  @Field()
  title: string

  @Field(_type => Int)
  duration: number

  @Field()
  @IsUrl()
  link: string

  @Field({ nullable: true })
  @IsUrl()
  previewUrl?: string
}

@ObjectType({ description: "A podcast episode" })
export class Episode extends Media {
  @Field()
  show: string
  type: "episode"
}

@ObjectType()
export class Album {
  @Field()
  title: string

  @Field(_type => [Artist])
  artists: Artist[]

  @Field()
  link: string

  @Field()
  imageUrl: string
}

@ObjectType({ description: "A track of music" })
export class Track extends Media {
  @Field(_type => [Artist])
  artists: Artist[]

  @Field(_type => Album)
  album: Album
  type: "track"
}

const EpisodeOrTrack = createUnionType({
  name: "EpisodeOrTrack",
  types: () => [Track, Episode] as const,
  resolveType: value => {
    if (isEpisode(value)) return Episode
    if (isTrack(value)) return Track
    return undefined
  },
})

@ObjectType()
export class PlaybackState {
  @Field()
  shuffle: boolean

  @Field()
  repeat: string

  @Field(_type => Int, {
    description: "Progress into the song in ms",
    nullable: true,
  })
  progress?: number
}

@ObjectType({ description: "The now playing song model" })
export class NowPlaying {
  @Field()
  isPlaying: boolean

  @Field(_type => EpisodeOrTrack, { nullable: true })
  track?: Episode | Track

  @Field(_type => PlaybackState, { nullable: true })
  state?: PlaybackState
}
