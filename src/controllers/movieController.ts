import { Request, Response } from "express";
import { ISql } from "../modules/db/isql";
import { MovieEarnings } from "../modules/earnings/movie/movieEarnings";

export class MovieController {
  private readonly sql: ISql;

  constructor(sql: ISql) {
    this.sql = sql;
  }

  public async get(req: Request, res: Response, next: any) {
    try {
      const movieId = parseInt(req.params.id, 10);
      const teamId = parseInt(req.query.team as string, 10);
      const team = await this.sql.getTeam(teamId);
      if (team === null) {
        res.status(404).send("Team not found");
        return;
      }

      const movie = await this.sql.getMovie(movieId, team);
      if (movie === null) {
        res.status(404).send("Movie not found");
        return;
      }

      const movieEarnings = MovieEarnings.getMovieEarningsDisplay(movie, team.players);
      const totalShares = movieEarnings.totalShares();
      const totalEarned = movieEarnings.totalEarnedDisp();
      const chart = MovieEarnings.getMovieEarningsChartData(movie);

      res.render("movie/get", {
        chart,
        movie,
        movieEarnings,
        team,
        title: `${movie.name} | Earnings`,
        totalEarned,
        totalShares,
      });
    } catch (e) {
      next(e);
    }
  }
}
