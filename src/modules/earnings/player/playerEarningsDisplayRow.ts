import accounting from "accounting";
import moment from "moment";
import { Movie } from "../../../models/movie";

export class PlayerEarningsDisplayRow {
  public name: string;
  public releaseDate: string;
  public shares: number;
  public earned: number;
  public earnedDisp: string;
  public bonus1Selection: boolean;
  public bonus2Selection: boolean;

  constructor(movie: Movie, shares: number, earned: number, bonus1: boolean, bonus2: boolean) {
    this.name = movie.name;
    this.releaseDate = moment(movie.releaseDate).format("MMM DD");
    this.shares = shares;
    this.earned = earned;
    this.earnedDisp = accounting.formatMoney(earned, "$", 0);
    this.bonus1Selection = bonus1;
    this.bonus2Selection = bonus2;
  }
}
