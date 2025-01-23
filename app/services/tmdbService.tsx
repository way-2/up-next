import { Configuration, DefaultApi } from "../generated-sources/openapi";

export default function getTmdbService(): DefaultApi {
    const configuration = new Configuration({
        apiKey: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjczZTMxZTljZjVlNmEyY2I2MzAwOWU1OWJlYWJlYiIsIm5iZiI6MTczNjc2OTUwNy42MTMsInN1YiI6IjY3ODRmZmUzMTQzMWUwNTkxYWJiYWVhOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZdOB_AyZdNj-aWOsErtD56XMOW9HoLb26DqN6BgopqY"
      });
      const tmdbApi = new DefaultApi(configuration);
      return tmdbApi;
}