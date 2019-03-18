import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
}
