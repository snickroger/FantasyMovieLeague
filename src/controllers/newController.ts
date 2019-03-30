import { Request, Response } from "express";
import Enumerable from "linq";
import { Team } from "../models/team";
import { MovieHelpers } from "../modules/helpers/movieHelpers";
import { ISeasonRepository } from "../repositories/season/iseasonRepository";
import { ITeamRepository } from "../repositories/team/iteamRepository";

export class NewController {
  private readonly seasonDb: ISeasonRepository;

  constructor(seasonDb: ISeasonRepository) {
    this.seasonDb = seasonDb;
  }

  public async index(req: Request, res: Response, next: any) {
    try {
      const seasons = await this.seasonDb.getAllSeasonsForMenu();
      const selectedSeason = await this.seasonDb.getSelectedSeason(req.query.season);
      const thanks: boolean = req.query.thanks === "1";

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).send("Season not found");
        return;
      }

      const startDate = selectedSeason.getStartDate();
      if (startDate <= new Date() && req.query.skip !== "1") {
        res.redirect(307, "/");
        return;
      }

      const selectedTeamArr = selectedSeason.teams;
      let selectedTeam: Team;
      if (req.query.team) {
        const teams = selectedTeamArr.filter((t) => t.slug === req.query.team);

        if (teams.length === 0) {
          res.status(404).send("Team not found");
          return;
        }
        selectedTeam = teams[0];
      } else {
        selectedTeam = selectedSeason.teams[0];
      }

      const movies = MovieHelpers.moviesForNewPage(Enumerable.from(selectedSeason.movies));

      let seasonStart: string = "";
      if (movies.length > 0) {
        seasonStart = movies[0].releaseDateTimestamp;
      }

      res.render("new/index", {
        seasons,
        selectedSeasonSlug: selectedSeason.slug,
        movies,
        newHeaderContent: selectedSeason.newHeaderContent,
        title: selectedSeason.pageTitle,
        seasonStart,
        bonusAmount: selectedSeason.getFormattedBonusAmount(),
        selectedTeam,
        thanks,
      });
    } catch (e) {
      next(e);
    }
  }
}
