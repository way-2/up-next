/**
 * Calculate the total number of episodes up to the current season and episode.
 * @param {Map<number, number[]>} seasonsInfo - A map of season numbers to episode arrays.
 * @param {number} currentSeason - The current season number.
 * @param {number} upNextEpisode - The next episode number to watch.
 * @returns {number} The total number of episodes up to the current season and episode.
 */
export function calcEpisodeOfTotal(
  seasonsInfo: Map<number, number[]>,
  currentSeason: number,
  upNextEpisode: number
): number {
  let epOfTotal = 0;
  for (const [season, episodes] of seasonsInfo.entries()) {
    if (season < currentSeason) {
      epOfTotal += episodes.length;
    } else if (season === currentSeason) {
      epOfTotal += upNextEpisode;
      break;
    }
  }
  return epOfTotal;
}

/**
 * Convert a Map to a JSON string.
 * @param {Map<any, any>} map - The map to convert.
 * @returns {string} The JSON string representation of the map.
 */
export function mapToJson(map: Map<any, any>): string {
  return JSON.stringify(Object.fromEntries(map));
}

/**
 * Convert a JSON string to a Map.
 * @param {string} jsonStr - The JSON string to convert.
 * @returns {Map<number, number[]>} The Map representation of the JSON string.
 */
export function jsonToMap(jsonStr: string): Map<number, number[]> {
  const obj = JSON.parse(jsonStr);
  return new Map<number, number[]>(
    Object.entries(obj).map(([key, value]) => [Number(key), value])
  );
}