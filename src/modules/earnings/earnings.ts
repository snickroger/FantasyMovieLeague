import Enumerable from "linq";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { MovieHelpers } from "../helpers/movieHelpers";
import { EarningsDisplay } from "./earningsDisplay";

export class Earnings {
  public static getEarnings(movies: Movie[], players: Player[]) {
    const earnings: EarningsDisplay[] = [];
    const bestAndWorstMovies = MovieHelpers.bestAndWorstMovies(Enumerable.from(movies));
    const playersEnum = Enumerable.from(players);

    for (const movie of movies) {
      const shares = MovieHelpers.totalSharesByMovie(Enumerable.from(movie.shares), playersEnum);
      const gross = MovieHelpers.maxEarningByMovie(Enumerable.from(movie.earnings));
      const isBestMovie = bestAndWorstMovies.bestMovies.any((m) => m.id === movie.id);
      const isWorstMovie = bestAndWorstMovies.worstMovies.any((m) => m.id === movie.id);
      earnings.push(new EarningsDisplay(movie, isBestMovie, isWorstMovie, shares, gross));
    }

    return earnings;
  }
}
