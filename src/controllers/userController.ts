import Router from "koa-router";
import UserService from "../services/userServices";
import { StatusCodes } from "http-status-codes";
import { CONNECTION, IServerError } from "../index";
import User, { IUserRegister } from "../models/user";

class UserControllerError extends Error implements IServerError {
  status: StatusCodes;
  constructor(message: string, status?: StatusCodes) {
    super(message);
    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

interface IUserController {
  userService: UserService;
}

const router = new Router<IUserController>();

// Inject the user repository into the context to use in routes
router.use(async (ctx, next) => {
  ctx.state.userService = new UserService(CONNECTION.getRepository(User));
  await next();
});

//#region Open Routes

// Create a new user
router.post("/users", async (ctx) => {
  const { email, password, username, taxId } = ctx.request
    .body as IUserRegister;
  if (!email || !password || !username) {
    throw new UserControllerError(
      "email, password, and username are required fields",
      StatusCodes.BAD_REQUEST
    );
  }
  const result = await ctx.state.userService.createUser({
    email,
    password,
    username,
  });
  ctx.body = result;
  ctx.status = StatusCodes.CREATED;
});

router.post("/login", async (ctx) => {
  const { password, username } = ctx.request.body as {
    username: string;
    password: string;
  };
  if (!password || !username) {
    throw new UserControllerError(
      "Username and password are required fields",
      StatusCodes.BAD_REQUEST
    );
  }

  const result = await ctx.state.userService.verifyPasswordAndReturnUser(
    username,
    password
  );

  ctx.body = result;
  ctx.status = StatusCodes.OK;
});

//#endregion

// Get all users
router.get("/users", async (ctx) => {
  const users = await ctx.state.userService.getAllUsers();
  ctx.status = StatusCodes.ACCEPTED;
  ctx.body = users;
});

export default router;
