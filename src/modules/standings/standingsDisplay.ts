import accounting from "accounting";
import { Player } from "../../models/player";
import { MovieHelpers } from "../helpers/movieHelpers";

export class StandingsDisplay {
  public rank: number;
  public name: string;
  public id: number;
  public hasBonus1: boolean;
  public hasBonus2: boolean;
  public sharesUsed: number;
  public total: number;
  public totalDisp: string;
  public perShare: number;
  public perShareDisp: string;
  public enteredMoneyPool: boolean;

  constructor(player: Player, hasBonus1: boolean, hasBonus2: boolean, sharesUsed: number, total: number) {
    this.rank = 0;
    this.name = player.name;
    this.id = player.id;
    this.hasBonus1 = hasBonus1;
    this.hasBonus2 = hasBonus2;
    this.sharesUsed = sharesUsed;
    this.total = total;
    this.totalDisp = accounting.formatMoney(total, "$", 0);
    this.perShare = total / sharesUsed || 0;
    this.perShareDisp = MovieHelpers.formatShortCurrency(sharesUsed > 0 ? total / sharesUsed : 0);
    this.enteredMoneyPool = player.enteredMoneyPool;
  }
}
