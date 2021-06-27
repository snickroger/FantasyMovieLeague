import Enumerable from "linq";
import { Movie } from "../../../models/movie";
import { Player } from "../../../models/player";
import { Team } from "../../../models/team";
import { MovieHelpers } from "../../helpers/movieHelpers";
import { PlayerEarningsDisplay } from "./playerEarningsDisplay";
import { PlayerEarningsDisplayRow } from "./playerEarningsDisplayRow";

export class PlayerEarnings {
  public static getPlayerEarningsDisplay(player: Player, team: Team, movies: Movie[],
    bonusAmount: number): PlayerEarningsDisplay {
    const earningRows: PlayerEarningsDisplayRow[] = [];
    const moviesObj = Enumerable.from(movies);
    const moviesSorted = moviesObj.orderBy((m) => m.id).toArray();
    const totalShares = moviesObj.toDictionary((k) => k.id, (v) =>
      MovieHelpers.totalSharesByMovie(Enumerable.from(v.shares), Enumerable.from(team.players)));
    const movieEarnings = moviesObj.toDictionary((k) => k.id, (v) =>
      MovieHelpers.maxEarningByMovie(Enumerable.from(v.earnings)));
    const bestAndWorstMovies = MovieHelpers.bestAndWorstMovies(moviesObj);
    let bonus1 = false;
    let bonus2 = false;

    for (const movie of moviesSorted) {
      let playerEarned = 0;
      const shares = Enumerable.from(movie.shares);
      const playerShares = shares.firstOrDefault((s) => s.playerId === player.id);
      const playerSharesNum = playerShares !== undefined ? playerShares.numShares : 0;
      const movieEarned = movieEarnings.get(movie.id);
      const sharesTotal = totalShares.get(movie.id);

      if (playerShares && sharesTotal > 0) {
        playerEarned = (playerShares.numShares / sharesTotal) * movieEarned;
      }

      bonus1 = bonus1 || bestAndWorstMovies.bestMovies.any((m) => m.id === movie.id) && player.bonus1Id === movie.id;
      bonus2 = bonus2 || bestAndWorstMovies.worstMovies.any((m) => m.id === movie.id) && player.bonus2Id === movie.id;

      earningRows.push(new PlayerEarningsDisplayRow(movie, playerSharesNum, playerEarned,
        player.bonus1Id === movie.id, player.bonus2Id === movie.id));
    }

    return new PlayerEarningsDisplay(earningRows, bonus1, bonus2, bonusAmount);
  }
}
