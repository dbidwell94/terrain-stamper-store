import Router from "koa-router";
import UserController from "./userController";
import StampController from "./stampController";
import { StatusCodes } from "http-status-codes";

export abstract class AbstractControllerError extends Error {
  status: StatusCodes;
  constructor(message: string, status?: StatusCodes) {
    super(message);
    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

const apiRouter = new Router({ prefix: "/api" });

apiRouter.get("/", async (ctx) => {
  console.log(ctx.user);
  ctx.body = { status: "online" };
  ctx.status = StatusCodes.OK;
});

apiRouter.use("/users", UserController.routes());
apiRouter.use(UserController.allowedMethods());
apiRouter.use("/stamps", StampController.routes());
apiRouter.use(StampController.allowedMethods());

export default apiRouter;
