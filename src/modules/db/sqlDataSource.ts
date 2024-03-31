import { Earning } from "../../models/earning";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Season } from "../../models/season";
import { Share } from "../../models/share";
import { Team } from "../../models/team";
import { Url } from "../../models/url";
import { DataSource } from "typeorm";
import "reflect-metadata";

export const MovieDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT!, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: ["warn", "error"],
    entities: [Earning, Movie, Player, Season, Share, Team, Url],
});
