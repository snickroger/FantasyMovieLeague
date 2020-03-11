import { Request, Response } from "express";
import Enumerable from "linq";
import moment = require("moment-timezone");
import { Movie } from "../models/movie";
import { Player } from "../models/player";
import { Season } from "../models/season";
import { Team } from "../models/team";
import { ISql } from "../modules/db/isql";

export class AdminController {
  private readonly sql: ISql;

  constructor(sql: ISql) {
    this.sql = sql;
  }

  public async index(req: Request, res: Response, next: any) {
    try {
      res.header("Cache-Control", "no-cache");
      const seasons = await this.sql.getAllSeasonsForMenu();
      res.render("admin/index", {
        title: "Admin Controls",
        newSeason: !!req.query.newSeason,
        seasons,
      });
    } catch (e) {
      next(e);
    }
  }

  public async newSeason(req: Request, res: Response, next: any) {
    try {
      res.header("Cache-Control", "no-cache");
      res.render("admin/new_season", {
        title: "Admin Controls | Create Season",
      });
    } catch (e) {
      next(e);
    }
  }

  public async createSeason(req: Request, res: Response, next: any) {
    try {
      const newSeason = Season.fromPostBody(req.body);
      await this.sql.addSeason(newSeason);

      const friends = new Team();
      friends.name = "Friends";
      friends.slug = "friends";
      friends.season = newSeason;

      const dealeron = new Team();
      dealeron.name = "DealerOn";
      dealeron.slug = "dealeron";
      dealeron.season = newSeason;

      await this.sql.addTeam(friends);
      await this.sql.addTeam(dealeron);

      res.redirect("/admin?newSeason=1");
    } catch (e) {
      next(e);
    }
  }

  public async listMovies(req: Request, res: Response, next: any) {
    try {
      res.header("Cache-Control", "no-cache");
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).contentType("text/plain").send("Season not found");
        return;
      }

      const movies = Enumerable.from(selectedSeason.movies).orderBy((m: Movie) => m.releaseDate).select((m: Movie) => ({
        id: m.id,
        name: m.name,
        releaseDate: moment(m.releaseDate).tz("America/New_York").format("ll"),
      })).toArray();

      res.render("admin/list_movies", {
        title: `Admin Controls | Movies | ${selectedSeason.name}`,
        seasonName: selectedSeason.name,
        seasonSlug: selectedSeason.slug,
        newMovie: !!req.params.newMovie,
        editedMovie: !!req.params.editedMovie,
        movies,
      });

    } catch (e) {
      next(e);
    }
  }

  public async newMovie(req: Request, res: Response, next: any) {
    try {
      res.header("Cache-Control", "no-cache");
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).contentType("text/plain").send("Season not found");
        return;
      }

      res.render("admin/add_edit_movie", {
        title: `Admin Controls | Movies | New`,
        movie: new Movie(),
        isEditing: false,
        seasonSlug: selectedSeason.slug,
      });
    } catch (e) {
      next(e);
    }
  }

  public async editMovie(req: Request, res: Response, next: any) {
    try {
      res.header("Cache-Control", "no-cache");
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).contentType("text/plain").send("Season not found");
        return;
      }

      const movie = await this.sql.getMovieInfo(parseInt(req.params.id, 10));
      if (movie === undefined) {
        // movie does not exist
        res.status(404).contentType("text/plain").send("Movie not found");
        return;
      }

      const releaseDate = moment(movie.releaseDate).format("YYYY-MM-DD");

      res.render("admin/add_edit_movie", {
        title: `Admin Controls | Movies | Edit`,
        movie,
        releaseDate,
        isEditing: true,
        seasonSlug: selectedSeason.slug,
      });
    } catch (e) {
      next(e);
    }
  }

  public async createOrUpdateMovie(req: Request, res: Response, next: any) {
    try {
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).contentType("text/plain").send("Season not found");
        return;
      }

      if (req.params.id) {
        // updating movie
        const editedMovie = Movie.fromPostBody(req.body);

        const movie = await this.sql.getMovieInfo(parseInt(req.params.id, 10));
        if (movie === undefined) {
          // movie does not exist
          res.status(404).contentType("text/plain").send("Movie not found");
          return;
        }

        await this.sql.saveMovie(Object.assign(movie, editedMovie));

        res.redirect(`/admin/movies?season=${selectedSeason.slug}&editedMovie=${editedMovie.id}`);
      } else {
        // new movie
        const newMovie = Movie.fromPostBody(req.body);
        newMovie.season = selectedSeason;
        await this.sql.saveMovie(newMovie);

        res.redirect(`/admin/movies?season=${selectedSeason.slug}&newMovie=1`);
      }
    } catch (e) {
      next(e);
    }
  }

  public async listPlayers(req: Request, res: Response, next: any) {
    try {
      res.header("Cache-Control", "no-cache");
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).contentType("text/plain").send("Season not found");
        return;
      }

      const teamIds = Enumerable.from(selectedSeason.teams).select((team) => team.id).toArray();
      const teams: Team[] = [];
      const playersToTeams: any = {};

      for (const teamId of teamIds) {
        const team = (await this.sql.getTeam(teamId));
        teams.push(team);

        for (const player of team.players) {
          const playerId = player.id;
          if (playersToTeams[playerId] === undefined) {
            playersToTeams[playerId] = [];
          }
          playersToTeams[playerId].push(teamId);
        }
      }

      const players = Enumerable.from(teams).selectMany((team) => team.players)
        .distinct((player) => player.id)
        .orderByDescending((player) => player.id)
        .select((player: Player) => ({
            id: player.id,
            name: player.name,
            teams: playersToTeams[player.id],
            createdAt: moment(player.createdAt).tz("America/New_York").format("lll"),
        })).toArray();

      res.render("admin/list_players", {
        title: `Admin Controls | Players | ${selectedSeason.name}`,
        seasonName: selectedSeason.name,
        seasonSlug: selectedSeason.slug,
        teams: Enumerable.from(teams).select(team => ({ id: team.id, name: team.name })).toArray(),
        players
      });
    } catch (e) {
      next(e);
    }
  }
}
