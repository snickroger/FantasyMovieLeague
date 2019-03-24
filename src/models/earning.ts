import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "./movie";

@Entity({ name: "earnings" })
export class Earning {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public gross!: number;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @ManyToOne(() => Movie, (movie) => movie.earnings)
  public movie!: Movie;
}
