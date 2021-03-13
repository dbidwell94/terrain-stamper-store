import { StatusCodes } from "http-status-codes";
import Router from "koa-router";
import Stamp, { IStampCreate, IStampView } from "../models/stamp";
import StampServices from "../services/stampServices";
import { CONNECTION } from "../index";
import koaBody from "koa-body";
import { v4 as uuid } from "uuid";
import * as fileSystem from "fs";
import fsProm from "fs/promises";
import paths from "path";
import { extractFile } from "../utils/index";
import UserServices from "../services/userServices";
import User from "../models/user";
import StampFile, { extensionsToFileType, IStampFileCreate } from "../models/stampFile";
import multer from "@koa/multer";
import checkAuth from "../middleware/validation";
import StampPicture, { IStampPictureCreate, validExtensions } from "../models/stampPicture";

const upload = multer();

class StampControllerError extends Error {
  readonly status: StatusCodes;
  constructor(message: string, status: StatusCodes) {
    super(message);
    this.status = status;
  }
}

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

router.use(checkAuth({ publicRoutes: [/\/public\/*/] }));

router.get("/public/stamps", async (ctx) => {
  let stamps: IStampView[];

  if (ctx.user.id !== 0) {
    const databaseUser = await ctx.state.userServices.getById(ctx.user.id);
    const isAdmin = databaseUser.roles.reduce<boolean>((isAdmin, role) => {
      if (!isAdmin) {
        return role.roleName.toLowerCase() === "admin";
      }
      return isAdmin;
    }, false);

    if (isAdmin) {
      stamps = await ctx.state.stampServices.getStampsMin({ adminUserId: ctx.user.id });
    } else {
      stamps = await ctx.state.stampServices.getStampsMin({});
    }
  } else {
    stamps = await ctx.state.stampServices.getStampsMin({});
  }

  ctx.body = stamps;
  ctx.status = StatusCodes.OK;
});

router.get("/public/stamp/:id", async (ctx) => {
  const { id } = ctx.params;
  const stamp = await ctx.state.stampServices.getStampMinById(id);
  ctx.body = stamp;
  ctx.status = StatusCodes.OK;
});

/**
 * ---Private routes---
 */

router.get("/stamps/byuser/:id", async (ctx) => {
  const { id } = ctx.params;
  const stamps = await ctx.state.stampServices.getStampsByUploadedUserId(id);

  ctx.body = stamps;
  ctx.status = StatusCodes.OK;
});

router.get("/stamps/mystamps", async (ctx) => {
  const { id } = ctx.user;

  const stamps = await ctx.state.stampServices.getStampsByUploadedUserId(id);

  ctx.body = stamps;
  ctx.status = StatusCodes.OK;
});

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

    const picsToSave: IStampPictureCreate[] = [];

    const uploadedUser = await ctx.state.userServices.getById(ctx.user.id);

    const stamp: IStampCreate = {
      name: stampName,
      folderLocation: baseDirectory,
      price,
      stampType,
      uploadedUser,
      files: [],
    };

    const databaseStamp = await ctx.state.stampServices.create((stamp as unknown) as Stamp);

    // Loop over files and add to StampFile[] and StampPicture[]
    for (let i = 0; i < extractedFiles.length; i++) {
      const fileExtension = extractedFiles[i].split(".").pop() as string;
      if (validExtensions.includes(fileExtension)) {
        picsToSave.push({
          fileLocation: extractedFiles[i],
          stamp: databaseStamp,
        });
      } else {
        filesToSave.push({
          fileType: extensionsToFileType[fileExtension],
          stamp: databaseStamp,
          fileLocation: extractedFiles[i],
        });
      }
    }

    databaseStamp.files = (filesToSave as unknown) as StampFile[];
    databaseStamp.pictures = (picsToSave as unknown) as StampPicture[];

    await ctx.state.stampServices.create(databaseStamp);

    ctx.body = { stampId: databaseStamp.id };
    ctx.status = StatusCodes.CREATED;
  } else {
    throw new StampControllerError("No file found", StatusCodes.BAD_REQUEST);
  }
});

export default router;
