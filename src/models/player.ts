import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable,
  ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "./movie";
import { Share } from "./share";
import { Team } from "./team";

@Entity({ name: "players"})
export class Player {

  public static fromPostBody(postBody: any, seasonMovies: Movie[]): Player {
    const movieIds = seasonMovies.map((m) => m.id);
    const movieShares = Object.keys(postBody).filter((k) => k.substr(0, 6) === "movie_");
    const playerName: string = postBody.whoareyou;
    const bonus1 = parseInt(postBody.bonus1, 10);
    const bonus2 = parseInt(postBody.bonus2, 10);

    const newPlayer = new Player();
    newPlayer.name = playerName;
    newPlayer.bonus1Id = bonus1;
    newPlayer.bonus2Id = bonus2;
    newPlayer.createdAt = new Date();
    newPlayer.updatedAt = new Date();
    newPlayer.shares = [];

    let sharesSum = 0;
    for (const movieShare of movieShares) {
      const movieId = parseInt(movieShare.replace("movie_", ""), 10);
      if (isNaN(movieId) || !movieIds.includes(movieId)) {
        throw new Error(`Unknown movie: ${movieShare}`);
      }

      const movie = seasonMovies.filter((m) => m.id === movieId)[0];
      const shares = parseInt(postBody[movieShare], 10);
      sharesSum += shares;

      const share = new Share();
      share.numShares = shares;
      share.movie = movie;

      newPlayer.shares.push(share);
    }

    if (sharesSum !== 100) {
      throw new Error(`Shares must total 100`);
    }

    return newPlayer;
  }
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @Column()
  public bonus1Id?: number;

  @Column()
  public bonus2Id?: number;

  @OneToMany(() => Share, (share) => share.player, { cascade: ["remove"], nullable: false })
  @JoinTable()
  public shares!: Share[];

  @Column()
  public enteredMoneyPool!: boolean;

  @ManyToMany(() => Team, (team) => team.players)
  public teams!: Team[];
}
