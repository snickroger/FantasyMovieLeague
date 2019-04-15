import accounting from "accounting";
import Enumerable from "linq";
import { MovieEarningsDisplayRow } from "./movieEarningsDisplayRow";

export class MovieEarningsDisplay {
  public rows: MovieEarningsDisplayRow[];
  
  public totalShares(): number {
    return Enumerable.from(this.rows).select(r => r.shares).sum();
  }

  public totalEarnedDisp() {
    const totalEarned = Enumerable.from(this.rows).select(r => r.earned).sum();
    return accounting.formatMoney(totalEarned, "$", 0);
  }

  constructor() {
    this.rows = [];
  }
}
