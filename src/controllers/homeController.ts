import { Request, Response } from "express";
import { ITeamRepository } from "../repositories/team/iteamRepository";

export class HomeController {
  private readonly teamDb: ITeamRepository;

  constructor(teamDb: ITeamRepository) {
    this.teamDb = teamDb;
  }

  public async index(req: Request, res: Response, next: any) {
    try {
      const team = await this.teamDb.getTeamBySeasonIdAndSlug(10, "friends");

      res.render("home/index_test", { title: "Testing" });
    } catch (e) {
      next(e);
    }
  }
}
