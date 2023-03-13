import Enumerable from "linq";
import { Movie } from "../../models/movie";

export class BestAndWorstMovies {
  public bestMovies: Enumerable.IEnumerable<Movie>;
  public worstMovies: Enumerable.IEnumerable<Movie>;

  constructor(bestMovies: Movie[], worstMovies: Movie[]) {
    this.bestMovies = Enumerable.from(bestMovies);
    this.worstMovies = Enumerable.from(worstMovies);
  }
}
