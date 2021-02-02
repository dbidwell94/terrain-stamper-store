import dotenv from "dotenv";
dotenv.config();


import koa from "koa";
import httpStatus from "http-status-codes";
import { Connection } from "typeorm";
import connection from "./databaseConnection";

const PORT: number = Number(process.env.PORT) || 1437;
const app = new koa();

// Basic error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode || error.status || httpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit("error", error, ctx);
  }
});

// Initial route
app.use(async (ctx) => {
  ctx.body = "Hello World";
});

export let CONNECTION: Connection | null = null;

app.on("error", console.error);

connection
  .then((con) => {
    CONNECTION = con;
    Object.freeze(CONNECTION);
    app.listen(PORT);
  })
  .catch(console.error);
