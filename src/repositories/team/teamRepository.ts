import { getManager } from "typeorm";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Share } from "../../models/share";
import { Team } from "../../models/team";
import { InvalidPostError } from "./invalidPostError";
import { ITeamRepository } from "./iteamRepository";

export class TeamRepository implements ITeamRepository {
  public async getTeam(id: number): Promise<Team> {
    const team = await getManager().getRepository(Team).createQueryBuilder("team")
      .innerJoinAndSelect("team.players", "players")
      .where("team.id = :id", { id })
      .getOne();

    return team!;
  }

  public async addPlayerToTeam(team: Team, seasonMovies: Movie[], postBody: any): Promise<Player> {
    const movieIds = seasonMovies.map((m) => m.id);
    const movieShares = Object.keys(postBody).filter((k) => k.substr(0, 6) === "movie_");
    const playerName: string = postBody.whoareyou;
    const bonus1 = parseInt(postBody.bonus1);
    const bonus2 = parseInt(postBody.bonus2);

    const newPlayer = new Player();
    newPlayer.name = playerName;
    newPlayer.bonus1Id = bonus1;
    newPlayer.bonus2Id = bonus2;
    newPlayer.teams = [team];
    newPlayer.createdAt = new Date();
    newPlayer.updatedAt = new Date();
    newPlayer.shares = [];

    const sharesToAdd: Share[] = [];
    let sharesSum = 0;
    for (const movieShare of movieShares) {
      const movieId = parseInt(movieShare.replace("movie_", ""));
      if (isNaN(movieId) || !movieIds.includes(movieId)) {
        throw new InvalidPostError();
      }

      const movie = seasonMovies.filter((m) => m.id === movieId)[0];
      const shares = parseInt(postBody[movieShare]);
      sharesSum += shares;

      const share = new Share();
      share.numShares = shares;
      share.movie = movie;

      sharesToAdd.push(share);
    }

    if (sharesSum !== 100) {
      throw new InvalidPostError();
    }

    await getManager().getRepository(Player).save(newPlayer);
    const sharePromises: Array<Promise<Share>> = [];
    for (const share of sharesToAdd) {
      share.player = newPlayer;
      newPlayer.shares.push(share);
      sharePromises.push(getManager().getRepository(Share).save(share));
    }

    await Promise.all(sharePromises);
    return newPlayer;
  }
}
