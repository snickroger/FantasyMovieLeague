import { Request, Response } from "express";
import { ISql } from "../modules/db/isql";
import { PlayerEarnings } from "../modules/earnings/player/playerEarnings";

export class PlayerController {
  private readonly sql: ISql;

  constructor(sql: ISql) {
    this.sql = sql;
  }

  public async get(req: Request, res: Response, next: any) {
    try {
      const playerId = parseInt(req.params.id, 10);
      const teamId = parseInt(req.query.team as string, 10);
      const team = await this.sql.getTeam(teamId);
      if (team === undefined) {
        res.status(404).send("Team not found");
        return;
      }

      const player = await this.sql.getPlayer(playerId);
      if (player === undefined) {
        res.status(404).send("Player not found");
        return;
      }

      const season = await this.sql.getSelectedSeason(team.season.slug);
      if (season === undefined) {
        res.status(404).send("Season not found for team");
        return;
      }

      const playerEarnings = PlayerEarnings.getPlayerEarningsDisplay(player, team,
        season.movies, season.bonusAmount);

      res.render("player/get", {
          player,
          playerEarnings,
          teamName: team.name,
          title: `${player.name} | Earnings`,
        });

    } catch (e) {
      next(e);
    }
  }
}
