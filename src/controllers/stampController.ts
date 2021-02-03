import { StatusCodes } from "http-status-codes";
import Router from "koa-router";
import Stamp from "models/stamp";
import StampServices from "services/stampServices";
import { CONNECTION } from "..";


interface IStampServiceProvider {
  stampServices: StampServices;
}

const router = new Router<IStampServiceProvider>();

router.use(async (ctx, next) => {
  ctx.state.stampServices = new StampServices(CONNECTION.getRepository(Stamp), Stamp);
  await next();
});

router.get("/stamps", async (ctx) => {
  const stamps = await ctx.state.stampServices.getAll();
  ctx.body = stamps;
  ctx.status = StatusCodes.OK;
});

router.get("/stamp/:id", async (ctx) => {
  const { id } = ctx.params;
  const stamp = await ctx.state.stampServices.getById(id);
  ctx.body = stamp;
  ctx.status = StatusCodes.OK;
});

export default router;
