import bodyParser from "body-parser";
import express from "express";
import path from "path";
import "reflect-metadata";
import favicon from "serve-favicon";
import { HomeController } from "./controllers/homeController";

const defaultParser = bodyParser.urlencoded({ extended: true });
const server = express();

const homeController = new HomeController();

server.use(defaultParser);
server.use(express.static("dist/public"));
server.use(favicon(path.join(__dirname, "public", "favicon.ico")));

server.set("view engine", "pug");
server.set("views", "dist/views");

server.get("/", homeController.index.bind(homeController));

server.listen(3000);
