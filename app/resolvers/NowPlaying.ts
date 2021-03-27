import {Artist, NowPlaying} from "../entities/NowPlaying"
import { Query, Resolver, UseMiddleware } from "type-graphql"
import Spotify from "spotify-web-api-node"

import { CacheControl } from "../middlewares"
import {isEpisode, isTrack} from "../guards";

@Resolver()
export class NowPlayingResolver {
  spotify: Spotify

  constructor() {
    this.spotify = new Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
      accessToken: process.env.SPOTIFY_ACCESS_TOKEN,
      refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
    })

    setInterval(() => {
      this.refreshAccessToken()
    }, 1800000) // 30 minutes

    this.refreshAccessToken()
  }

  refreshAccessToken() {
    this.spotify.refreshAccessToken((error, response) => {
      if (!error) this.spotify.setAccessToken(response.body.access_token)
      if (error) console.error(error)
    })
  }

  mapArtist(
    artist: SpotifyApi.ArtistObjectSimplified | SpotifyApi.ArtistObjectFull,
  ): Artist {
    return {
      name: artist.name,
      link: artist.external_urls.spotify,
    }
  }

  @Query((_returns) => NowPlaying)
  @UseMiddleware(CacheControl(10)) // Caches the result so we don't need to talk to Spotify every single request
  async nowPlaying(): Promise<NowPlaying> {
    const {
      body: PlaybackInfo,
    } = await this.spotify.getMyCurrentPlaybackState()


    const response: NowPlaying = {
      isPlaying: PlaybackInfo.is_playing || false
    }

    if (PlaybackInfo.is_playing) {
      if (isTrack(PlaybackInfo.item)){
        response.track = {
          title: PlaybackInfo.item.name,
          duration: PlaybackInfo.item.duration_ms,
          link: PlaybackInfo.item.external_urls.spotify,
          previewUrl: PlaybackInfo.item.preview_url || undefined,
          artists: PlaybackInfo.item.artists.map(this.mapArtist),
          album: {
            title: PlaybackInfo.item.album.name,
            artists: PlaybackInfo.item.album.artists.map(this.mapArtist),
            link: PlaybackInfo.item.album.external_urls.spotify,
            imageUrl: PlaybackInfo.item.album.images[0].url
          },
          type: "track"
        }
      }

      if (isEpisode(PlaybackInfo.item)) {
        response.track = {
          title: PlaybackInfo.item.name,
          duration: PlaybackInfo.item.duration_ms,
          link: PlaybackInfo.item.external_urls.spotify,
          previewUrl: PlaybackInfo.item.audio_preview_url || undefined,
          show: PlaybackInfo.item.show.name,
          type: "episode"
        }
      }

      response.state = {
        shuffle: PlaybackInfo.shuffle_state,
        repeat: PlaybackInfo.repeat_state.toUpperCase(),
        progress: PlaybackInfo.progress_ms || undefined
      }
    }

    return response
  }
}
