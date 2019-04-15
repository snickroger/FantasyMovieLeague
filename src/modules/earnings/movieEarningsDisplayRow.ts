import accounting from "accounting";

export class MovieEarningsDisplayRow {
  public name: string;
  public bonus1Selection: boolean;
  public bonus2Selection: boolean;
  public shares: number;
  public earned: number;
  public earnedDisp: string;

  constructor(name: string, bonus1Selection: boolean, bonus2Selection: boolean, shares: number, earned: number) {
    this.name = name;
    this.bonus1Selection = bonus1Selection;
    this.bonus2Selection = bonus2Selection;
    this.shares = shares;
    this.earned = earned;
    this.earnedDisp = accounting.formatMoney(earned, "$", 0);
  }
}
