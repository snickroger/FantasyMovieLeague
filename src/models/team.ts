import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./player";
import { Season } from "./season";

@Entity({ name: "teams"})
export class Team {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public slug!: string;

  @ManyToOne(() => Season, (season) => season.teams)
  public season!: Season;

  @ManyToMany(() => Player, (player) => player.teams)
  @JoinTable({ name: "player_teams" })
  public players!: Player[];
}
