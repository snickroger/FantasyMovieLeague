import { Team } from "../../models/team";

export interface ITeamRepository {
  getTeam(id: number): Promise<Team>;
}
