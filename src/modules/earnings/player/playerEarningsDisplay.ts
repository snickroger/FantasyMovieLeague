import accounting from "accounting";
import Enumerable from "linq";
import { PlayerEarningsDisplayRow } from "./playerEarningsDisplayRow";

export class PlayerEarningsDisplay {
  public rows: PlayerEarningsDisplayRow[];
  public total: number;
  public totalDisp: string;
  public bonus1: boolean;
  public bonus2: boolean;
  public bonusAmount: number;
  public bonusAmountDisp: string;

  constructor(rows: PlayerEarningsDisplayRow[], bonus1: boolean, bonus2: boolean, bonusAmount: number) {
    const total = Enumerable.from(rows).sum((row) => row.earned) +
      (bonus1 ? bonusAmount : 0) + (bonus2 ? bonusAmount : 0);
    this.rows = rows;
    this.total = total;
    this.totalDisp = accounting.formatMoney(total, "$", 0);
    this.bonus1 = bonus1;
    this.bonus2 = bonus2;
    this.bonusAmount = bonusAmount;
    this.bonusAmountDisp = accounting.formatMoney(this.bonusAmount, "$", 0);
  }
}
