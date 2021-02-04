import { StatusCodes } from "http-status-codes";
import Router from "koa-router";
import Stamp from "../models/stamp";
import StampServices from "../services/stampServices";
import { CONNECTION } from "../index";
import koaBody from "koa-body";
import { v4 as uuid } from "uuid";
import * as fileSystem from "fs";
import fsProm from "fs/promises";
import paths from "path";
import jwt from "koa-jwt";
import { SECRET } from "../utils/index";

class StampControllerError extends Error {
  readonly status: StatusCodes;
  constructor(message: string, status: StatusCodes) {
    super(message);
    this.status = status;
  }
}

const pathToFileRegex = /([^\/]+$)/;

interface IStampServiceProvider {
  stampServices: StampServices;
}

const router = new Router<IStampServiceProvider>();

router.use(async (ctx, next) => {
  ctx.state.stampServices = new StampServices(CONNECTION.getRepository(Stamp), Stamp);
  await next();
});

router.get("/public/stamps", async (ctx) => {
  const stamps = await ctx.state.stampServices.getAll();
  ctx.body = stamps;
  ctx.status = StatusCodes.OK;
});

router.get("/public/stamp/:id", async (ctx) => {
  const { id } = ctx.params;
  const stamp = await ctx.state.stampServices.getById(id);
  ctx.body = stamp;
  ctx.status = StatusCodes.OK;
});

router.use(jwt({ secret: SECRET }).unless({ path: [/.*\/public\/?.*/] }));

router.post("/stamp/upload", koaBody({ multipart: true }), async (ctx) => {
  if (ctx.request.files && !Array.isArray(ctx.request.files.stamp)) {
    const { name, path } = ctx.request.files.stamp;

    console.log({ name, path });
    const fileName = paths.join(__dirname, "../../stamps", `${uuid()}${name}`);
    fileSystem.copyFileSync(path, fileName);
    fsProm.rm(path);
  }

  ctx.status = 200;
});

export default router;
