import Router from "koa-router";
import UserController from "./userController";
import { StatusCodes } from "http-status-codes";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.get("/", async (ctx) => {
  ctx.body = { status: "online" };
  ctx.status = StatusCodes.OK;
});

apiRouter.use("/users", UserController.routes());
apiRouter.use(UserController.allowedMethods());

export default apiRouter;
