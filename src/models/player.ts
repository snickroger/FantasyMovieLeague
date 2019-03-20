import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable,
  ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "./movie";
import { Share } from "./share";
import { Team } from "./team";

@Entity({ name: "players"})
export class Player {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @OneToOne(() => Movie)
  @JoinColumn()
  public bonus1?: Movie;

  @OneToOne(() => Movie)
  @JoinColumn()
  public bonus2?: Movie;

  @OneToMany(() => Share, (share) => share.movie, { cascade: ["remove"], nullable: false })
  @JoinTable()
  public shares!: Share[];

  @Column()
  public enteredMoneyPool!: boolean;

  @ManyToMany(() => Team, (team) => team.players)
  public teams!: Team[];
}
