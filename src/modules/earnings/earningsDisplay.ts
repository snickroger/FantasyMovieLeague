import accounting from "accounting";
import moment from "moment";
import { Movie } from "../../models/movie";
import { MovieHelpers } from "../helpers/movieHelpers";

export class EarningsDisplay {
  public id: number;
  public name: string;
  public releaseDateInt: number;
  public releaseDate: string;
  public rating?: number;
  public isBestMovie: boolean;
  public isWorstMovie: boolean;
  public posterUrl: string;
  public shares: number;
  public gross: number;
  public grossDisp: string;
  public grossDispShort: string;
  public value: number;
  public valueDisp: string;
  public valueDispShort: string;

  constructor(movie: Movie, isBestMovie: boolean, isWorstMovie: boolean, shares: number, gross: number) {
    const value = gross / shares || 0;
    this.id = movie.id;
    this.name = movie.name;
    this.releaseDateInt = parseInt(moment(movie.releaseDate).format("X"), 10);
    this.releaseDate = moment(movie.releaseDate).format("MMM DD");
    this.rating = movie.rating;
    this.isBestMovie = isBestMovie;
    this.isWorstMovie = isWorstMovie;
    this.posterUrl = `/images/${(movie.imdb || "").replace("https://www.imdb.com/title/", "")}.jpg`;
    this.shares = shares;
    this.gross = gross;
    this.grossDisp = accounting.formatMoney(gross, "$", 0);
    this.grossDispShort = MovieHelpers.formatShortCurrency(gross);
    this.value = value;
    this.valueDisp = accounting.formatMoney(value, "$", 0);
    this.valueDispShort = MovieHelpers.formatShortCurrency(value);
  }
}
