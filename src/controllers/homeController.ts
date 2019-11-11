import { Request, Response } from "express";
import { ISql } from "../modules/db/isql";
import { Earnings } from "../modules/earnings/home/earnings";
import { Standings } from "../modules/standings/standings";

export class HomeController {
  private readonly sql: ISql;

  constructor(sql: ISql) {
    this.sql = sql;
  }

  public async index(req: Request, res: Response, next: any) {
    try {
      const seasons = await this.sql.getAllSeasonsForMenu();
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).send("Season not found");
        return;
      }

      const startDate = selectedSeason.getStartDate();
      if (startDate > new Date() && req.query.skip !== "1") {
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
      const seasons = await this.sql.getAllSeasonsForMenu();
      // returns latest/current season if ?season= not given:
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        res.status(404).send("Season not found");
        return;
      }

      const startDate = selectedSeason.getStartDate();
      if (startDate > new Date() && req.query.skip !== "1") {
        res.redirect(307, "/new");
        return;
      }

      const selectedTeamArr = selectedSeason.teams.filter((t) => t.slug === req.params.teamId);
      if (selectedTeamArr.length === 0) {
        res.status(404).send("Team not found");
        return;
      }

      const selectedTeamId: number = selectedTeamArr[0].id;
      const selectedTeam = await this.sql.getTeam(selectedTeamId);
      if (selectedTeam === undefined) {
        res.status(404).send("Team not found");
        return;
      }

      const standings = Standings.getStandingsDisplay(selectedSeason.movies, selectedTeam.players,
        selectedSeason.bonusAmount);
      const earnings = Earnings.getEarningsDisplay(selectedSeason.movies, selectedTeam.players);

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
        usingMoneyPool: selectedTeam.moneyPool !== null,
        selectedTeamId,
        endDate,
      });
    } catch (e) {
      next(e);
    }
  }
  public async indexTeamText(req: Request, res: Response, next: any) {
    try {
      // returns latest/current season if ?season= not given:
      const selectedSeason = await this.sql.getSelectedSeason(req.query.season);

      if (selectedSeason === undefined) {
        res.status(404).send("Season not found");
        return;
      }

      const startDate = selectedSeason.getStartDate();
      if (startDate > new Date() && req.query.skip !== "1") {
        res.redirect(307, "/new");
        return;
      }

      const selectedTeamArr = selectedSeason.teams.filter((t) => t.slug === req.params.teamId);
      if (selectedTeamArr.length === 0) {
        res.status(404).send("Team not found");
        return;
      }

      const selectedTeamId: number = selectedTeamArr[0].id;
      const selectedTeam = await this.sql.getTeam(selectedTeamId);
      if (selectedTeam === undefined) {
        res.status(404).send("Team not found");
        return;
      }

      const standings = Standings.getStandingsDisplay(selectedSeason.movies, selectedTeam.players,
        selectedSeason.bonusAmount);
      const standingsText = Standings.getStandingsDisplayText(standings, selectedTeam.slug);

      res.contentType("text/plain").send(standingsText);
    } catch (e) {
      next(e);
    }
  }
}
