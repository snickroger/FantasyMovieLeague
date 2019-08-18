import { Request, Response } from "express";
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
        seasons
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
}
