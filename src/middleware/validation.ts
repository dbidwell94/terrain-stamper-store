import { StatusCodes } from "http-status-codes";
import { BaseContext, ExtendableContext, Middleware, Next, ParameterizedContext } from "koa";
import Router from "koa-router";
import { IServerError } from "src";

interface IAuthCheckOptions {
  publicRoutes: RegExp[];
}

class AuthError extends Error implements IServerError {
  status: StatusCodes;
  constructor(message: string, status: StatusCodes) {
    super(message);
    this.status = status;
  }
}

type RouterContextAlias = ParameterizedContext<any, Router.IRouterParamContext<any, {}>>;
type ReturnMiddleware = Middleware<ParameterizedContext<any, Router.IRouterParamContext<any, {}>>>[];

export default function checkAuth(options: IAuthCheckOptions) {
  return async function middleware(ctx: RouterContextAlias, next: Next) {
    let isPublicRoute: boolean = false;

    options.publicRoutes.forEach((route) => {
      if (route.test(ctx.path)) {
        isPublicRoute = true;
        return;
      }
    });

    if (!isPublicRoute) {
      if (ctx.user.id === 0 || !ctx.user.username) {
        throw new AuthError("Auth invalid. Please log in again.", StatusCodes.FORBIDDEN);
      }
      await next();
    } else {
      await next();
    }
  };
}
