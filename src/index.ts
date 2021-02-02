import koa from "koa";
import httpStatus from "http-status-codes";
import dotenv from "dotenv";

dotenv.config();
const PORT: number = Number(process.env.PORT) || 1437;
const app = new koa();

// Basic error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode || error.status || httpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit("error", error, ctx);
  }
});

// Initial route
app.use(async (ctx) => {
  ctx.body = "Hello World";
});

app.on("error", console.error);

app.listen(PORT);
