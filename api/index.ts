import { Application, Router, Context } from 'https://deno.land/x/oak/mod.ts';
import { getNFTTrades } from './FTXAPI.ts';

const PORT = 8000;
const app = new Application();
var messages = ['first message'];

const router = new Router();
router
  .get("/", async (context) => {
    context.response.body = "../client/index.html";
    //context.response.body = await getNFTTrades();
  })
  .get("/messages", (context) => {
    context.response.body = messages;
  })
  .post("/message", async (context) => {
    const body = await context.request.body().value;
    messages.push(body);
    console.log(body);
  });

//app.use(logging);
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: PORT });
