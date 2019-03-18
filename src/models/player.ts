import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie";

@Entity({ name: "players"})
export class Player {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public createdAt!: Date;

  @Column()
  public updatedAt!: Date;

  @OneToOne(() => Movie)
  @JoinColumn()
  public bonus1?: Movie;

  @OneToOne(() => Movie)
  @JoinColumn()
  public bonus2?: Movie;

  @Column()
  public enteredMoneyPool!: boolean;
}
