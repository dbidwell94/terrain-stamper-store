import Router from "koa-router";
import { CONNECTION } from "..";
import StampPicture from "../models/stampPicture";
import PictureServices from "../services/pictureServices";
import path from "path";
import fs from "fs";
import { StatusCodes } from "http-status-codes";

interface IStampPictureProvider {
  pictureServices: PictureServices;
}

const router = new Router<IStampPictureProvider>();

router.use(async (ctx, next) => {
  ctx.state.pictureServices = new PictureServices(CONNECTION.getRepository(StampPicture), StampPicture);
  await next();
});

router.get("/picture/:id", async (ctx) => {
  const { id } = ctx.params;
  const picture = await ctx.state.pictureServices.getPictureMinById(id);

  const location = path.join(picture.stamp.folderLocation, picture.fileLocation);

  ctx.status = StatusCodes.OK;
  ctx.set("content-type", "image/png");
  ctx.body = fs.createReadStream(location);
});

export default router;
