import dotenv from "dotenv";
dotenv.config();

import koa from "koa";
import httpStatus, { StatusCodes } from "http-status-codes";
import { Connection } from "typeorm";
import connection from "./databaseConnection";
import apiRouter from "controllers/index";
import koaBody from "koa-body";
import cors from "@koa/cors";

export interface IServerError {
  message: string;
  status: StatusCodes;
}

const PORT: number = Number(process.env.PORT) || 1437;
const app = new koa();
app.use(koaBody());
app.use(cors());

// Basic error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || error.status || httpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error: error.message };
    ctx.app.emit("error", error, ctx);
  }
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

export let CONNECTION: Connection;

app.on("error", console.error);

connection
  .then((con) => {
    CONNECTION = con;
    Object.freeze(CONNECTION);
    app.listen(PORT);
  })
  .catch(console.error);
