import { getManager } from "typeorm";
import { Team } from "../../models/team";
import { ITeamRepository } from "./iteamRepository";

export class TeamRepository implements ITeamRepository {
  public async getTeam(id: number): Promise<Team> {
    const team = await getManager().getRepository(Team).createQueryBuilder("team")
      .innerJoinAndSelect("team.players", "players")
      .where("team.id = :id", { id })
      .getOne();

    return team!;
  }
}
