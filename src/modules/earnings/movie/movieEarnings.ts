import Enumerable from "linq";
import moment from "moment";
import { Movie } from "../../../models/movie";
import { Player } from "../../../models/player";
import { MovieHelpers } from "../../helpers/movieHelpers";
import { MovieEarningsDisplay } from "./movieEarningsDisplay";
import { MovieEarningsDisplayRow } from "./movieEarningsDisplayRow";

export class MovieEarnings {
  public static getMovieEarningsDisplay(movie: Movie, players: Player[]): MovieEarningsDisplay {
    const earnings: MovieEarningsDisplay = new MovieEarningsDisplay();
    const earningRows: MovieEarningsDisplayRow[] = [];
    const movieEarned = MovieHelpers.maxEarningByMovie(Enumerable.from(movie.earnings));
    const movieShares = Enumerable.from(movie.shares);
    const movieSharesTotal = MovieHelpers.totalSharesByMovie(movieShares, Enumerable.from(players));

    for (const player of players) {
      const playerShares = movieShares.firstOrDefault((s) => s.playerId === player.id);
      const playerSharesNum = playerShares !== null ? playerShares.numShares : 0;
      const playerEarned = playerSharesNum > 0 && movieSharesTotal > 0
        ? (playerSharesNum / movieSharesTotal) * movieEarned
        : 0;

      const bonus1 = player.bonus1Id === movie.id;
      const bonus2 = player.bonus2Id === movie.id;

      earningRows.push(new MovieEarningsDisplayRow(player.name, bonus1, bonus2, playerSharesNum, playerEarned));
    }

    earnings.rows = Enumerable.from(earningRows).orderByDescending((row) => row.earned).toArray();
    return earnings;
  }

  public static getMovieEarningsChartData(movie: Movie): string {
    const earningPoints = Enumerable.from(movie.earnings).where((e) => e.createdAt.getDay() === 0)
      .orderBy((e) => e.createdAt).select((e) => ({ t: moment(e.createdAt).format("LL"), y: e.gross }))
      .toArray();

    return JSON.stringify(earningPoints);
  }
}
