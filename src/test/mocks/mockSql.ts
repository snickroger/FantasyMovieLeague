import { Earning } from "../../models/earning";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Season } from "../../models/season";
import { Team } from "../../models/team";
import { ISql } from "../../modules/db/isql";
import { SeasonMenuItem } from "../../modules/db/seasonMenuItem";

export class MockSql implements ISql {
  private static readonly seasons: Season[] = [MockSql.getSeason1(), MockSql.getSeason2()];

  private static getSeason1(): Season {
    const season1: Season = new Season();
    const alice = new Player();
    alice.id = 10;
    alice.name = "Alice";

    const bob = new Player();
    bob.id = 11;
    bob.name = "Bob";

    const charlie = new Player();
    charlie.id = 12;
    charlie.name = "Charlie";

    const david = new Player();
    david.id = 13;
    david.name = "David";

    const eve = new Player();
    eve.id = 14;
    eve.name = "Eve";

    const team = {
      players: [alice, bob, charlie, david, eve],
      id: 1,
      name: "Friends",
      slug: "friends",
      season: season1,
    };

    season1.id = 1;
    season1.name = "Season 1";
    season1.slug = "season1";
    season1.pageTitle = "Season 1";
    season1.bonusAmount = 5000000;
    season1.teams = [team];
    season1.movies = [{
      id: 1,
      name: "Rocky VI",
      rating: 88,
      releaseDate: new Date(2018, 1, 1),
      limited: false,
      shares: [
        { id: 1, player: alice, playerId: 10, numShares: 5, movie: {} as any },
        { id: 2, player: bob, playerId: 11, numShares: 10, movie: {} as any },
        { id: 3, player: charlie, playerId: 12, numShares: 0, movie: {} as any },
        { id: 4, player: david, playerId: 13, numShares: 3, movie: {} as any },
        { id: 5, player: eve, playerId: 14, numShares: 7, movie: {} as any },
      ],
      earnings: [
        { id: 1, gross: 180000000, createdAt: new Date(2018, 1, 1), updatedAt: new Date(2018, 1, 1), movie: {} as any },
      ],
      season: season1,
    }];

    return season1;
  }

  private static getSeason2(): Season {
    const season2: Season = new Season();
    const player1 = new Player();
    player1.id = 10;
    player1.name = "Player 1";
    player1.bonus1Id = 1;
    player1.bonus2Id = 4;

    const player2 = new Player();
    player2.id = 11;
    player2.name = "Player 2";
    player2.bonus1Id = undefined;
    player2.bonus2Id = undefined;

    const player3 = new Player();
    player3.id = 12;
    player3.name = "Player 3";
    player3.bonus1Id = 1;
    player3.bonus2Id = 4;

    const player4 = new Player();
    player4.id = 13;
    player4.name = "Player 4";
    player4.bonus1Id = 3;
    player4.bonus2Id = 4;

    const team = {
      players: [player1, player2, player3, player4],
      id: 1,
      name: "Friends",
      slug: "friends",
      season: season2,
    };

    season2.id = 2;
    season2.name = "Season 2";
    season2.slug = "season2";
    season2.pageTitle = "Season 2";
    season2.bonusAmount = 5000000;
    season2.teams = [team];
    season2.movies = [{
      id: 1,
      name: "A",
      rating: 88,
      releaseDate: new Date(2017, 12, 31),
      limited: false,
      shares: [
        { id: 1, player: player1, playerId: 10, numShares: 2, movie: {} as any },
        { id: 2, player: player2, playerId: 11, numShares: 1, movie: {} as any },
      ],
      earnings: [
        { id: 2, gross: 60000000, createdAt: new Date(2018, 1, 1), 
          updatedAt: new Date(2018, 1, 1), movie: {} as any },
        { id: 1, gross: 35000000, createdAt: new Date(2017, 12, 31), 
          updatedAt: new Date(2017, 12, 31), movie: {} as any },
      ],
      season: season2,
    }, {
      id: 2,
      name: "B",
      rating: 39,
      releaseDate: new Date(2017, 12, 31),
      limited: false,
      shares: [
        { id: 3, player: player2, playerId: 11, numShares: 1, movie: {} as any },
        { id: 4, player: player3, playerId: 12, numShares: 1, movie: {} as any },
      ],
      earnings: [
        { id: 3, gross: 100000000, createdAt: new Date(2018, 1, 1), updatedAt: new Date(2018, 1, 1), movie: {} as any },
      ],
      season: season2,
    }, {
      id: 3,
      name: "C",
      rating: 99,
      releaseDate: new Date(2017, 12, 31),
      limited: false,
      shares: [
        { id: 5, player: player2, playerId: 11, numShares: 2, movie: {} as any },
        { id: 6, player: player4, playerId: 13, numShares: 8, movie: {} as any },
      ],
      earnings: [
        { id: 4, gross: 40000000, createdAt: new Date(2018, 1, 1), updatedAt: new Date(2018, 1, 1), movie: {} as any },
      ],
      season: season2,
    }, {
      id: 4,
      name: "D",
      rating: 50,
      releaseDate: new Date(2018, 1, 7),
      limited: false,
      shares: [
        { id: 7, player: player2, playerId: 11, numShares: 3, movie: {} as any },
        { id: 8, player: player3, playerId: 12, numShares: 4, movie: {} as any },
      ],
      earnings: [],
      season: season2,
    }, {
      id: 5,
      name: "E",
      rating: undefined,
      releaseDate: new Date(2018, 1, 7),
      limited: false,
      shares: [
        { id: 7, player: player2, playerId: 11, numShares: 3, movie: {} as any },
        { id: 8, player: player3, playerId: 12, numShares: 4, movie: {} as any },
      ],
      earnings: [],
      season: season2,
    }];

    return season2;
  }
  private readonly selectedIndex: number;

  constructor(index: number) {
    this.selectedIndex = index;
  }

  public getAllSeasonsForMenu(): Promise<SeasonMenuItem[]> {
    throw new Error("Method not implemented.");
  }
  public getSelectedSeason(seasonSlug: string): Promise<Season> {
    return new Promise((resolve) => resolve(MockSql.seasons[this.selectedIndex]));
  }
  public getTeam(id: number): Promise<Team> {
    const season = MockSql.seasons[this.selectedIndex];
    const matchingTeams = season.teams.filter((t) => t.id === id);
    if (matchingTeams.length === 0) {
      throw new Error("Team not found");
    }
    return new Promise((resolve) => resolve(matchingTeams[0]));
  }
  public getMovie(id: number, team: Team): Promise<Movie | undefined> {
    const season = MockSql.seasons[this.selectedIndex];
    const matchingMovies = season.movies.filter((t) => t.id === id);
    return new Promise((resolve) => resolve(matchingMovies[0]));
  }
  public addPlayerToTeam(player: Player, team: Team): Promise<Player> {
    throw new Error("Method not implemented.");
  }
  public addEarningsForMovies(earning: Earning[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public deleteEarningsForDate(dateStr: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public updateRatingForMovie(movie: Movie, rating: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
