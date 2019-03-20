import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie";
import { Player } from "./player";

@Entity({ name: "shares"})
export class Share {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("int", { name: "num_shares" })
  public numShares!: number;

  @ManyToOne(() => Player, (player) => player.shares)
  @JoinTable()
  public player!: Player;

  @ManyToOne(() => Movie, (movie) => movie.shares)
  @JoinTable()
  public movie!: Movie;

}
