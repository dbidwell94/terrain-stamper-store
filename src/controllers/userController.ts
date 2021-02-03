import Router from "koa-router";
import UserService from "services/userServices";
import { StatusCodes } from "http-status-codes";
import { CONNECTION, IServerError } from "src/index";
import { SECRET, checkPrivileges } from "utils/index";
import User, { IUserRegister, IUserUpdate } from "models/user";
import jwt from "koa-jwt";
import jwtSerializer from "jsonwebtoken";

class UserControllerError extends Error implements IServerError {
  status: StatusCodes;
  constructor(message: string, status?: StatusCodes) {
    super(message);
    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

interface IUserToken {
  id: number;
  username: string;
}

interface IUserController {
  userService: UserService;
  user: IUserToken;
}

const router = new Router<IUserController>();

// Inject the user repository into the context to use in routes
router.use(async (ctx, next) => {
  ctx.state.userService = new UserService(CONNECTION.getRepository(User), User);
  await next();
});

router.use(
  jwt({ secret: SECRET }).unless({
    path: [/.*\/login\/?/, /.*\/register\/?/],
  })
);

//#region Open Routes

// Create a new user
router.post("/register", async (ctx) => {
  const { email, password, username, taxId, roles: requestedRoles } = ctx.request.body as IUserRegister;
  if (!email || !password || !username) {
    throw new UserControllerError("email, password, and username are required fields", StatusCodes.BAD_REQUEST);
  }
  const result = await ctx.state.userService.createUser({
    email,
    password,
    username,
    taxId,
    roles: requestedRoles,
  });
  const token = jwtSerializer.sign({ id: result.id, username: result.username }, SECRET);
  ctx.body = { token };
  ctx.status = StatusCodes.CREATED;
});

// Log user in
router.post("/login", async (ctx) => {
  const { password, username } = ctx.request.body as {
    username: string;
    password: string;
  };
  if (!password || !username) {
    throw new UserControllerError("Username and password are required fields", StatusCodes.BAD_REQUEST);
  }

  const {
    createdAt,
    email,
    roles,
    updatedAt,
    taxId,
    ...signMe
  } = await ctx.state.userService.verifyPasswordAndReturnUser(username, password);

  const token = jwtSerializer.sign(signMe, SECRET);

  ctx.body = { token };
  ctx.status = StatusCodes.OK;
});

//#endregion

// Get all users
router.get("/users", async (ctx) => {
  const users = await ctx.state.userService.getAllUserMins();
  ctx.status = StatusCodes.ACCEPTED;
  ctx.body = users;
});

router.get("/user/:id", async (ctx) => {
  const { id } = ctx.params;
  const response = await ctx.state.userService.getUserMinById(id);
  ctx.body = response;
  ctx.status = StatusCodes.OK;
});

router.put("/user/:id", async (ctx) => {
  const { id: userId } = ctx.params;
  const { id } = ctx.state.user;
  const userMin = ctx.request.body as IUserUpdate;
  if (
    !(await checkPrivileges({
      paramId: userId,
      tokenId: id,
      userService: ctx.state.userService,
    }))
  ) {
    throw new UserControllerError(
      "You do not have sufficient permissions to access this resource",
      StatusCodes.FORBIDDEN
    );
  }
  const response = await ctx.state.userService.updateUser(userMin, userId);
  ctx.body = response;
  ctx.status = StatusCodes.ACCEPTED;
});

export default router;
