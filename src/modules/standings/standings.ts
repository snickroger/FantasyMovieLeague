import Enumerable from "linq";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { MovieHelpers } from "../helpers/movieHelpers";
import { StandingsDisplay } from "./standingsDisplay";

export class Standings {
  public static getStandingsDisplay(moviesArr: Movie[], players: Player[], bonusAmount: number): StandingsDisplay[] {
    const movies = Enumerable.from(moviesArr);
    const totalShares = movies.toDictionary((k) => k.id, (v) =>
      MovieHelpers.totalSharesByMovie(Enumerable.from(v.shares), Enumerable.from(players)));
    const movieEarnings = movies.toDictionary((k) => k.id, (v) =>
      MovieHelpers.maxEarningByMovie(Enumerable.from(v.earnings)));
    const bestAndWorstMovies = MovieHelpers.bestAndWorstMovies(movies);
    const standings: StandingsDisplay[] = [];

    for (const player of players) {
      let total = 0;
      let bonus1 = false;
      let bonus2 = false;
      let sharesUsed = 0;
      const bonus1Id = player.bonus1Id !== undefined ? player.bonus1Id : 0;
      const bonus2Id = player.bonus2Id !== undefined ? player.bonus2Id : 0;

      for (const movie of moviesArr) {
        const playerShares = Enumerable.from(movie.shares).firstOrDefault((s) => s.playerId === player.id);
        const movieEarned = movieEarnings.get(movie.id);
        const shareTotal = totalShares.get(movie.id);
        if (playerShares && movieEarned > 0 && shareTotal > 0) {
          total += (playerShares.numShares / shareTotal) * movieEarned;
          sharesUsed += playerShares.numShares;
        }

        if (bestAndWorstMovies.bestMovies.any((m) => m.id === movie.id) && bonus1Id === movie.id) {
          bonus1 = true;
          total += bonusAmount;
        }
        if (bestAndWorstMovies.worstMovies.any((m) => m.id === movie.id) && bonus2Id === movie.id) {
          bonus2 = true;
          total += bonusAmount;
        }
      }

      total = Math.round(total);
      standings.push(new StandingsDisplay(player, bonus1, bonus2, sharesUsed, total));
    }

    const sortedStandings = Enumerable.from(standings).orderByDescending((s) => s.total).toArray();
    let rank = 1;
    let lastRank = 1;
    let lastTotal = 0;
    for (const standing of sortedStandings) {
      if (standing.total === lastTotal) {
        standing.rank = lastRank;
      } else {
        standing.rank = rank;
        lastRank = rank;
      }
      rank++;
      lastTotal = standing.total;
    }

    return sortedStandings;
  }
}
