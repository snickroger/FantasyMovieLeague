import { Request, Response } from "express";
import Enumerable from "linq";
import { Team } from "../models/team";
import { IEmailSender } from "../modules/emailSender/iemailSender";
import { MovieHelpers } from "../modules/helpers/movieHelpers";
import { ISeasonRepository } from "../repositories/season/iseasonRepository";
import { ITeamRepository } from "../repositories/team/iteamRepository";

export class NewController {
  private readonly seasonDb: ISeasonRepository;
  private readonly teamDb: ITeamRepository;
  private readonly emailSender: IEmailSender;

  constructor(seasonDb: ISeasonRepository, teamDb: ITeamRepository, emailSender: IEmailSender) {
    this.seasonDb = seasonDb;
    this.teamDb = teamDb;
    this.emailSender = emailSender;
  }

  public async index(req: Request, res: Response, next: any) {
    try {
      const seasons = await this.seasonDb.getAllSeasonsForMenu();
      const selectedSeason = await this.seasonDb.getSelectedSeason(req.query.season);
      const thanks: boolean = req.query.thanks === "1";

      if (selectedSeason === undefined) {
        // season does not exist
        res.status(404).contentType("text/plain").send("Season not found");
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
          res.status(404).contentType("text/plain").send("Team not found");
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

  public async postNew(req: Request, res: Response, next: any) {
    try {
      const currentSeason = await this.seasonDb.getSelectedSeason(undefined);
      if (currentSeason === undefined) {
        res.status(404);
        return;
      }

      const startDate = currentSeason.getStartDate();
      if (startDate <= new Date()) {
        res.status(403).contentType("text/plain").send("Season has already begun.");
        return;
      }

      const teams = currentSeason.teams.filter((t) => t.id.toString() === req.body.teamId);
      if (teams.length === 0) {
        res.status(404).contentType("text/plain").send("Team not found.");
        return;
      }
      const selectedTeam = teams[0];
      const savedPlayer = await this.teamDb.addPlayerToTeam(selectedTeam, currentSeason.movies, req.body);

      if (req.body.email) {
        const envelope = this.emailSender.getEmail(req.body.email, savedPlayer, currentSeason.name);
        await this.emailSender.sendMail(envelope);
      }

      res.redirect(`/new?team=${selectedTeam.slug}&thanks=1`);
    } catch (e) {
      next(e);
    }
  }
}
