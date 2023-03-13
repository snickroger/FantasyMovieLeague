import accounting from "accounting";
import moment from "moment";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie";
import { Team } from "./team";
import { Url } from "./url";

@Entity({ name: "seasons" })
export class Season {
  public static fromPostBody(postBody: any): Season {
    const newSeason = new Season();
    newSeason.name = postBody.season_name;
    newSeason.pageTitle = postBody.page_title;
    newSeason.slug = postBody.slug;
    newSeason.bonusAmount = postBody.bonus_amount;
    newSeason.newHeaderContent = postBody.header_content;
    newSeason.urls = [];

    const urls: string[] = postBody.urls.split("\n");
    for (const url of urls) {
      const urlObj = new Url();
      urlObj.url = url.trim();
      newSeason.urls.push(urlObj);
    }

    return newSeason;
  }

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
  public teams!: Team[];

  public getStartDate(): Date {
    return this.movies.sort(this.compareDate)[0].releaseDate;
  }

  public getEndDate(): Date {
    const endDate = moment(this.movies.sort((a, b) => -this.compareDate(a, b))[0].releaseDate).add(4, "weeks");
    return endDate.toDate();
  }

  public getFormattedBonusAmount(): string {
    return accounting.formatMoney(this.bonusAmount, "$", 0);
  }

  private compareDate(a: Movie, b: Movie): number {
    if (a.releaseDate < b.releaseDate) {
      return -1;
    }
    if (a.releaseDate > b.releaseDate) {
      return 1;
    }
    return 0;
  }
}
