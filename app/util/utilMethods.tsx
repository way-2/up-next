export function calcEpisodeOfTotal(
  seasonsInfo: Map<number, number[]>,
  currentSeason: number,
  upNextEpisode: number
) {
  let epOfTotal = 0;
  for (let [season, episodes] of seasonsInfo.entries()) {
    if (season < currentSeason) {
      epOfTotal += episodes.length;
    } else if (season === currentSeason) {
      epOfTotal += upNextEpisode;
      break;
    }
  }
  return epOfTotal;
}

export function mapToJson(map: Map<any, any>) {
  return JSON.stringify(Object.fromEntries(map));
}
