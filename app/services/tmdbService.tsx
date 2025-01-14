import { MovieDb, SearchTvRequest } from 'moviedb-promise'

const moviedb = new MovieDb('a673e31e9cf5e6a2cb63009e59beabeb')

const newError = (name) => {
  const e = new Error(name)
  e.name = name
  return Promise.reject(e)
}

export const searchTv = async (req: SearchTvRequest) => {
  try {
    const res = await moviedb.searchTv(req);
    return res.results;
  } catch (error) {
    console.log(error);
    return newError(error);
  }
}

export const tvInfo = async (id) => {
  try {
    const res = await moviedb.tvInfo(id);
    return res;
  } catch (error) {
    console.log(error);
    return newError(error);
  }
}