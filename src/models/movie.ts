import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Season } from "./season";

@Entity({ name: "movies" })
export class Movie {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public mappedName?: string;

  @Column()
  public plot?: string;

  @Column()
  public actors?: string;

  @Column()
  public director?: string;

  @Column()
  public releaseDate!: Date;

  @Column()
  public imdb?: string;

  @Column()
  public rottenTomatoesUrl?: string;

  @Column("int")
  public rating?: number;

  @Column()
  public limited!: boolean;

  @Column("int")
  public percentLimit?: number;

  @ManyToOne(() => Season, (season) => season.movies)
  public season!: Season;

  @Column()
  public metacriticUrl?: string;
}
