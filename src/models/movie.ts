import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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

  @Column()
  public percentLimit?: number;

  @Column()
  public seasonId!: number;

  @Column()
  public metacriticUrl?: string;
}
