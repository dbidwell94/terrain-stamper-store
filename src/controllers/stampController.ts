import { StatusCodes } from "http-status-codes";
import Router from "koa-router";
import Stamp, { IStampCreate } from "../models/stamp";
import StampServices from "../services/stampServices";
import { CONNECTION } from "../index";
import koaBody from "koa-body";
import { v4 as uuid } from "uuid";
import * as fileSystem from "fs";
import fsProm from "fs/promises";
import paths from "path";
import jsonWebToken from "jsonwebtoken";
import jwt from "koa-jwt";
import { extractFile, SECRET } from "../utils/index";
import UserServices from "../services/userServices";
import User from "../models/user";
import StampFile, { extensionsToFileType, IStampFileCreate } from "../models/stampFile";

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
  userServices: UserServices;
}

const router = new Router<IStampServiceProvider>();

router.use(async (ctx, next) => {
  ctx.state.stampServices = new StampServices(CONNECTION.getRepository(Stamp), Stamp);
  ctx.state.userServices = new UserServices(CONNECTION.getRepository(User), User);
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

// router.use(jwt({ secret: SECRET }).unless({ path: [/.*\/public\/?.*/] }));

router.post("/stamp/upload", koaBody({ multipart: true }), async (ctx) => {
  if (ctx.request.files && !Array.isArray(ctx.request.files) && !Array.isArray(ctx.request.files.stamp)) {
    const { path, name } = ctx.request.files.stamp;

    const body = ctx.request.body;

    if (!("stampName" in body) || !("stampType" in body) || !("price" in body)) {
      await fsProm.rm(path);
      throw new StampControllerError("stampName, stampType, and price are required fields", StatusCodes.BAD_REQUEST);
    }

    const { stampName, stampType, price } = body as { stampName: string; stampType: string; price: number };

    const fileName = `${uuid()}${name}`;

    const dirName = paths.join(__dirname, "../../assets", fileName);
    fileSystem.mkdirSync(dirName);
    const fullPath = paths.join(dirName, fileName);
    fileSystem.copyFileSync(path, fullPath);

    // Extract to base directory
    const baseDirectory = await extractFile({ target: fullPath, deleteOriginal: true });

    // Delete uploaded tempfile
    await fsProm.rm(path);

    const extractedFiles = fileSystem.readdirSync(baseDirectory);

    const filesToSave: IStampFileCreate[] = [];

    const uploadedUser = await ctx.state.userServices.getById(ctx.user.id);

    const stamp: IStampCreate = {
      name: stampName,
      folderLocation: baseDirectory,
      price,
      stampType,
      uploadedUser,
      files: [],
    };
    // Loop over files and add to StampFile[]
    for (let i = 0; i < extractedFiles.length; i++) {
      const fileExtension = extractedFiles[i].split(".").pop() as string;
      filesToSave.push({
        fileType: extensionsToFileType[fileExtension],
        stamp,
        fileLocation: extractedFiles[i],
      });
    }

    const databaseStamp = await ctx.state.stampServices.create((stamp as unknown) as Stamp);

    databaseStamp.files = (filesToSave as unknown) as StampFile[];

    await ctx.state.stampServices.create(databaseStamp);

    ctx.body = await ctx.state.stampServices.getById(databaseStamp.id);
    ctx.status = StatusCodes.CREATED;
  } else {
    throw new StampControllerError("No file found", StatusCodes.BAD_REQUEST);
  }
});

export default router;
