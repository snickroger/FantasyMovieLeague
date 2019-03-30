import { Request, Response } from "express";
import { Earnings } from "../modules/earnings/earnings";
import { Standings } from "../modules/standings/standings";
import { ISeasonRepository } from "../repositories/season/iseasonRepository";
import { ITeamRepository } from "../repositories/team/iteamRepository";

export class HomeController {
  private readonly seasonDb: ISeasonRepository;
  private readonly teamDb: ITeamRepository;

  constructor(seasonDb: ISeasonRepository, teamDb: ITeamRepository) {
    this.seasonDb = seasonDb;
    this.teamDb = teamDb;
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

      const teams = selectedSeason.teams.map((t) => ({ id: t.slug, name: t.name }));
      res.render("home/index_noteam", {
        title: selectedSeason.pageTitle,
        teams,
        slug: selectedSeason.slug,
        seasons,
      });
    } catch (e) {
      next(e);
    }
  }

  public async indexTeam(req: Request, res: Response, next: any) {
    try {
      const seasons = await this.seasonDb.getAllSeasonsForMenu();
      // returns latest/current season if ?season= not given:
      const selectedSeason = await this.seasonDb.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        res.status(404).send("Season not found");
        return;
      }

      const startDate = selectedSeason.getStartDate();
      if (startDate > new Date()) {
        res.redirect(307, "/new");
        return;
      }

      const selectedTeamArr = selectedSeason.teams.filter((t) => t.slug === req.params.teamId);
      if (selectedTeamArr.length === 0) {
        res.status(404).send("Team not found");
        return;
      }

      const selectedTeamId: number = selectedTeamArr[0].id;
      const selectedTeam = await this.teamDb.getTeam(selectedTeamId);
      if (selectedTeam === undefined) {
        res.status(404).send("Team not found");
        return;
      }

      const standings = Standings.getStandings(selectedSeason.movies, selectedTeam.players, selectedSeason.bonusAmount);
      const earnings = Earnings.getEarnings(selectedSeason.movies, selectedTeam.players);

      const teams = selectedSeason.teams.map((t) => ({ id: t.slug, name: t.name }));
      const endDate = selectedSeason.getEndDate();

      res.render("home/index", {
        title: selectedSeason.pageTitle,
        seasons,
        teams,
        standings,
        earnings,
        teamSlug: selectedTeam.slug,
        seasonSlug: selectedSeason.slug,
        usingMoneyPool: true,
        selectedTeamId,
        endDate,
      });
    } catch (e) {
      next(e);
    }
  }

}
