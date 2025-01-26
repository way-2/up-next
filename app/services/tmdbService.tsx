import { Configuration, DefaultApi } from "../generated-sources/openapi";
import { upNextTableItem } from "../models/dbModels";
import { calcEpisodeOfTotal, mapToJson } from "../util/utilMethods";

/**
 * Get an instance of the TMDB API service.
 * @returns {DefaultApi} An instance of the TMDB API service.
 */
export default function getTmdbService(): DefaultApi {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;
  const configuration = new Configuration({
    apiKey: `Bearer ${apiKey}`
  })
  return new DefaultApi(configuration);
}

export async function refreshDataFromTmdb(items: upNextTableItem[]) {
    items.forEach(async (item: upNextTableItem) => {
      await getTmdbService().tvSeriesDetails(item.id).then((res) => {
        var tempSeasons = new Map();
        res.data.seasons?.forEach((season) => {
          if (season.season_number !== undefined && season.season_number > 0) {
            var tempEpisodes = [...Array(season.episode_count).keys()].map(
              (foo) => foo + 1
            );
            tempSeasons.set(season.season_number, tempEpisodes);
          }
        });
        item.seasonsInfo = mapToJson(tempSeasons);
        item.totalEpisodes = res.data.number_of_episodes ?? 0;
        item.imagePath = "https://image.tmdb.org/t/p/w500/" + res.data.poster_path;
        item.upNextEpisodeOutOfTotal = calcEpisodeOfTotal(tempSeasons, item.currentSeason, item.upNextEpisode);
      }).catch((ex) => console.log(ex));
    });
  }