import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Earning } from "./earning";
import { Season } from "./season";
import { Share } from "./share";

@Entity({ name: "movies" })
export class Movie {
  public static fromPostBody(postBody: any): Movie {
    const newMovie = new Movie();
    newMovie.name = postBody.movie_name;
    newMovie.mappedName = postBody.mapped_name;
    newMovie.plot = postBody.plot;
    newMovie.actors = postBody.actors;
    newMovie.director = postBody.director;
    newMovie.releaseDate = postBody.release_date;
    newMovie.imdb = postBody.imdb;
    newMovie.metacriticUrl = postBody.metacritic;
    newMovie.limited = false;
    return newMovie;
  }

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

  @OneToMany(() => Earning, (earning) => earning.movie, { cascade: ["remove"], nullable: false })
  @JoinTable()
  public earnings!: Earning[];

  @OneToMany(() => Share, (share) => share.movie, { cascade: ["remove"], nullable: false })
  @JoinTable()
  public shares!: Share[];

  @Column()
  public metacriticUrl?: string;
}
