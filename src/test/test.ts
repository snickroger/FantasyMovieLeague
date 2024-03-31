import assert from "assert";
import fs from "fs";
import "mocha";
import path from "path";
import { Season } from "../models/season";
import { Team } from "../models/team";
import { MetacriticParser } from "../modules/earningsDownloader/metacriticParser";
import { MojoParser } from "../modules/earningsDownloader/mojoParser";
import { Standings } from "../modules/standings/standings";
import { StandingsDisplay } from "../modules/standings/standingsDisplay";
import { MockSql } from "./mocks/mockSql";

describe("revenues", () => {
  describe("MojoParser", () => {
    const filePath = path.join(__dirname, "mocks/data/mojoResponse.txt");
    const html = fs.readFileSync(filePath).toString();
    const movies = MojoParser.parse(html);

    it("has 200 movies", () => {
      assert.equal(movies.length, 200);
    });

    it("has Thor in position 88", () => {
      assert.equal(movies[88].name, "Thor: Ragnarok");
    });

    it("has Star Wars with a $620M gross", () => {
      assert.equal(movies[18].gross, 620181382);
    });

    it("has 3 movies after filtering", () => {
      const rows = MojoParser.getEarnings(movies, [
        { name: "Thor: Ragnarok" },
        { name: "Star Wars: Episode VIII - The Last Jedi" },
        { name: "Coco" }] as any);
      assert.equal(rows.length, 3);
    });
  });

  describe("MetacriticParser", () => {
    const filePath = path.join(__dirname, "mocks/data/mcResponse1.txt");
    const noRatingfilePath = path.join(__dirname, "mocks/data/mcResponse2.txt");
    const html = fs.readFileSync(filePath).toString();
    const noRatingHtml = fs.readFileSync(noRatingfilePath).toString();

    it("has Widows with a 86% rating", () => {
      const rating = MetacriticParser.getRating(html);
      assert.equal(rating, 86);
    });
    it("has Vice with no rating", () => {
      const rating = MetacriticParser.getRating(noRatingHtml);
      assert.equal(rating, null);
    });
  });

  describe("Standings (README Example)", () => {
    const mockSql = new MockSql(0);
    let season: Season;
    let team: Team;
    let sortedStandings: StandingsDisplay[];

    before(async () => {
      season = await mockSql.getSelectedSeason("dummy");
      team = await mockSql.getTeam(1);
      sortedStandings = Standings.getStandingsDisplay(season.movies, team.players, 0);
    });

    it("has Bob in 1st with $72,000,000", () => {
      assert.equal(sortedStandings[0].name, "Bob");
      assert.equal(sortedStandings[0].total, 72000000);
    });

    it("has Eve in 2nd with $50,400,000", () => {
      assert.equal(sortedStandings[1].name, "Eve");
      assert.equal(sortedStandings[1].total, 50400000);
    });

    it("has Alice in 3rd with $36,000,000", () => {
      assert.equal(sortedStandings[2].name, "Alice");
      assert.equal(sortedStandings[2].total, 36000000);
    });

    it("has David in 4th with $21,600,000", () => {
      assert.equal(sortedStandings[3].name, "David");
      assert.equal(sortedStandings[3].total, 21600000);
    });

    it("has Charlie in 5th with $0", () => {
      assert.equal(sortedStandings[4].name, "Charlie");
      assert.equal(sortedStandings[4].total, 0);
    });
  });

  describe("Standings (More)", () => {
    const mockSql = new MockSql(1);
    let season: Season;
    let team: Team;
    let sortedStandings: StandingsDisplay[];

    before(async () => {
      season = await mockSql.getSelectedSeason("dummy");
      team = await mockSql.getTeam(1);
      sortedStandings = Standings.getStandingsDisplay(season.movies, team.players, 5000000);
    });

    it("has Player 4 in last", () => {
      assert.equal(sortedStandings[sortedStandings.length - 1].name, "Player 4");
    });

    it("has Player 4 with Bonus 1", () => {
      assert(sortedStandings[sortedStandings.length - 1].hasBonus1);
    });

    it("has Player 2 in 1st with $78,000,000", () => {
      assert.equal(sortedStandings[0].name, "Player 2");
      assert.equal(sortedStandings[0].total, 78000000);
    });

    it("has Player 3 in 2nd with $50,000,000", () => {
      assert.equal(sortedStandings[1].name, "Player 3");
      assert.equal(sortedStandings[1].total, 50000000);
    });

    it("has Player 1 in 3rd with $40,000,000", () => {
      assert.equal(sortedStandings[2].name, "Player 1");
      assert.equal(sortedStandings[2].total, 40000000);
    });

    it("has Player 4 in 4th with $37,000,000", () => {
      assert.equal(sortedStandings[3].name, "Player 4");
      assert.equal(sortedStandings[3].total, 37000000);
    });
  });
});
