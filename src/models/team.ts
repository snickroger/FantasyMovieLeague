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

  @Column()
  public moneyPool?: string;

  @ManyToMany(() => Player, (player) => player.teams)
  @JoinTable({ name: "player_teams", joinColumn: { name: "teamId" }, inverseJoinColumn: { name: "playerId" }})
  public players!: Player[];
}
