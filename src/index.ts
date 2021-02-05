import dotenv from "dotenv";
dotenv.config();

import koa, { BaseContext, ExtendableContext } from "koa";
import httpStatus, { StatusCodes } from "http-status-codes";
import { Connection } from "typeorm";
import connection from "./databaseConnection";
import apiRouter from "./controllers/index";
import koaBody from "koa-body";
import cors from "@koa/cors";
import RoleServices from "./services/roleServices";
import Role from "./models/role";
import jsonWebToken from "jsonwebtoken";
import UserServices from "./services/userServices";
import User from "./models/user";
import { SECRET } from "./utils";

interface ITokenUser {
  id: number;
  username: string;
}

declare module "koa" {
  interface BaseContext {
    user: ITokenUser;
  }
}

export interface IServerError {
  message: string;
  status: StatusCodes;
}

class ServerError extends Error implements IServerError {
  status: StatusCodes;
  constructor(message: string, status: StatusCodes) {
    super(message);
    this.status = status;
  }
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

// Global token auth middleware (add userid and username to context)
app.use(async (ctx, next) => {
  const bToken = ctx.get("authorization");
  if (!bToken) {
    ctx.user = { id: 0, username: "" };
  } else {
    const token = bToken.split(" ")[1];
    const { id, username } = jsonWebToken.decode(token) as ITokenUser;

    try {
      jsonWebToken.verify(token, SECRET);
    } catch (err) {
      throw new ServerError(err.message || "Auth invalid. Please log in again", StatusCodes.FORBIDDEN);
    }

    if (!id || !username) {
      throw new ServerError("Auth invalid. Please log in again", StatusCodes.FORBIDDEN);
    }
    const userServices = new UserServices(CONNECTION.getRepository(User), User);
    try {
      await userServices.getById(id);
    } catch (err) {
      throw new ServerError("Auth invalid Please log in again", StatusCodes.FORBIDDEN);
    }
    ctx.user = { id, username };
  }
  await next();
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

export let CONNECTION: Connection;

app.on("error", console.error);

connection
  .then(async (con) => {
    CONNECTION = con;
    Object.freeze(CONNECTION);
    new RoleServices(CONNECTION.getRepository(Role))
      .seedDatabase()
      .then(() => app.listen(PORT))
      .catch(console.error);
  })
  .catch(console.error);
