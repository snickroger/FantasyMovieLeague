import { Request, Response } from "express";
import { ISeasonRepository } from "../repositories/season/iseasonRepository";

export class HomeController {
  private readonly seasonDb: ISeasonRepository;

  constructor(seasonDb: ISeasonRepository) {
    this.seasonDb = seasonDb;
  }

  public async index(req: Request, res: Response, next: any) {
    try {
      const seasons = await this.seasonDb.getAllSeasonsForMenu();
      const selectedSeason = await this.seasonDb.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).send("Season not found");
        return;
      }

      const startDate = selectedSeason.getStartDate();
      if (startDate > new Date()) {
        res.redirect(307, "/new");
      }

      res.render("home/index_noteam", {
        title: selectedSeason.pageTitle,
        teams: selectedSeason.teams,
        slug: selectedSeason.slug,

        seasons,
      });
    } catch (e) {
      next(e);
    }
  }
}
