import Enumerable, { IEnumerable } from "linq";
import { Movie } from "../../models/movie";

export class BestAndWorstMovies {
  public bestMovies: IEnumerable<Movie>;
  public worstMovies: IEnumerable<Movie>;

  constructor(bestMovies: Movie[], worstMovies: Movie[]) {
    this.bestMovies = Enumerable.from(bestMovies);
    this.worstMovies = Enumerable.from(worstMovies);
  }
}
