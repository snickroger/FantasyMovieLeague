import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie";
import { Team } from "./team";
import { Url } from "./url";

@Entity({ name: "seasons" })
export class Season {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public pageTitle!: string;

  @Column()
  public slug!: string;

  @Column("int")
  public bonusAmount!: number;

  @Column()
  public newHeaderContent?: string;

  @OneToMany(() => Url, (url) => url.season, { cascade: ["remove"], nullable: false })
  @JoinTable()
  public urls!: Url[];

  @OneToMany(() => Movie, (movie) => movie.season, { cascade: ["remove"], nullable: false })
  @JoinTable()
  public movies!: Movie[];

  @OneToMany(() => Team, (team) => team.season, { cascade: ["remove"], nullable: false })
  @JoinTable()
  public teams!: Movie[];
}
