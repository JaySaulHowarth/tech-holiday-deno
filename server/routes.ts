import { Router } from "https://deno.land/x/oak/mod.ts";
import { getIndex, getRightmoveData } from "./controller.js";

const router = new Router();
router.get("/", getIndex);
router.get("/rightmovedata", getRightmoveData);

export default router;
