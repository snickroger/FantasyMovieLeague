import { IEnumerable } from "linq";
import { Earning } from "../../models/earning";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Share } from "../../models/share";
import { BestAndWorstMovies } from "./bestAndWorstMovies";

export class MovieHelpers {
  public static totalSharesByMovie(shares: IEnumerable<Share>, players: IEnumerable<Player>): number {
    return shares
      .where((s) => players.any((p) => p.id === s.id))
      .select((v) => v.numShares)
      .sum();
  }

  public static maxEarningByMovie(earnings: IEnumerable<Earning>): number {
    const maxEarning = earnings.count() === 0 ? 0 :
      earnings.orderByDescending((e) => e.createdAt).first().gross;
    return maxEarning;
  }

  public static formatShortCurrency(value: number): string {
    if (value >= 1e9) {
      return (value / 1e9).toPrecision(3) + "b";
    }
    if (value >= 1e6) {
      return (value / 1e6).toPrecision(3) + "m";
    }
    if (value >= 1e3) {
      return (value / 1e3).toPrecision(3) + "k";
    }
    return "";
  }

  public static bestAndWorstMovies(movies: IEnumerable<Movie>): BestAndWorstMovies {
    if (!movies.any((m) => m.rating != null)) {
      return new BestAndWorstMovies([], []);
    }
    const bestMovieRating = movies.where((m) => m.rating !== undefined).max((m) => m.rating || 0);
    const worstMovieRating = movies.where((m) => m.rating !== undefined).min((m) => m.rating || 0);
    const bestMovies = movies.where((m) => m.rating === bestMovieRating).toArray();
    const worstMovies = movies.where((m) => m.rating === worstMovieRating).toArray();

    return new BestAndWorstMovies(bestMovies, worstMovies);
  }
}
