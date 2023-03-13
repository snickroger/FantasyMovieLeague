import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Season } from "./season";

@Entity({ name: "urls"})
export class Url {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public url!: string;

  @ManyToOne(() => Season, (season) => season.urls)
  @JoinTable()
  public season?: Season;
}
