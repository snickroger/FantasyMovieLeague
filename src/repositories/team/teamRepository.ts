import { getManager } from "typeorm";
import { Team } from "../../models/team";
import { ITeamRepository } from "./iteamRepository";

export class TeamRepository implements ITeamRepository {
  public async getTeamBySeasonIdAndSlug(seasonId: number, slug: string): Promise<Team | undefined> {
    const team = await getManager().getRepository(Team).createQueryBuilder("team")
      .innerJoinAndSelect("team.season", "season")
      .innerJoinAndSelect("team.players", "players")
      .where("season.id = :seasonId AND team.slug = :slug", { seasonId, slug })
      .getOne();

    return team;
  }
}
