import { Application, Router, Context } from 'https://deno.land/x/oak/mod.ts';

const PORT = 8000;
const app = new Application();
var messages = ['first message'];

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
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
