import { Application, Context } from "https://deno.land/x/oak/mod.ts";
import router from "./routes.ts";

const HOST = "127.0.0.1";
const PORT = 8000;
const app = new Application();
const logging = async (ctx: Context, next: Function) => {
  console.log(`HTTP ${ctx.request.method} on ${ctx.request.url}`);
  await next();
};

app.use(router.routes());
app.use(router.allowedMethods());
app.use(logging);

console.log(`Listening on port ${PORT} ...`);
await app.listen(`${HOST}:${PORT}`);
