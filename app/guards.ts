export function isEpisode(arg: any): arg is SpotifyApi.EpisodeObjectFull {
  return arg.type === "episode";
}

export function isTrack(arg: any): arg is SpotifyApi.TrackObjectFull {
  return arg.type === "track";
}
