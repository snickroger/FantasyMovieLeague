import { Request, Response } from "express";
import Enumerable from "linq";
import moment = require("moment");
import { Movie } from "../models/movie";
import { Season } from "../models/season";
import { ISql } from "../modules/db/isql";

export class AdminController {
  private readonly sql: ISql;

  constructor(sql: ISql) {
    this.sql = sql;
  }

  public async index(req: Request, res: Response, next: any) {
    try {
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

      res.redirect("/admin?newSeason=1");
    } catch (e) {
      next(e);
    }
  }

  public async listMovies(req: Request, res: Response, next: any) {
    try {
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).contentType("text/plain").send("Season not found");
        return;
      }

      const movies = Enumerable.from(selectedSeason.movies).orderBy((m: Movie) => m.releaseDate).select((m: Movie) => ({
        id: m.id,
        name: m.name,
        releaseDate: moment(m.releaseDate).format("ll"),
      })).toArray();

      res.render("admin/list_movies", {
        title: `Admin Controls | Movies | ${selectedSeason.name}`,
        seasonName: selectedSeason.name,
        seasonSlug: selectedSeason.slug,
        movies,
      });

    } catch (e) {
      next(e);
    }
  }
}
