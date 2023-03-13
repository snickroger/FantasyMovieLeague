import moment from "moment";
import { Movie } from "../../models/movie";

export class MovieNewDisplay {
  public id: number;
  public name: string;
  public plot?: string;
  public actors?: string;
  public director?: string;
  public imdb?: string;
  public limited!: boolean;
  public percentLimit?: number;
  public releaseDateShort: string;
  public releaseDateTimestamp: string;

  constructor(movie: Movie) {
    this.id = movie.id;
    this.name = movie.name;
    this.plot = movie.plot;
    this.actors = movie.actors;
    this.director = movie.director;
    this.imdb = movie.imdb;
    this.limited = movie.limited;
    this.percentLimit = movie.percentLimit;
    this.releaseDateShort = moment(movie.releaseDate).format("MMM DD");
    this.releaseDateTimestamp = moment(movie.releaseDate).format("x");
  }
}
