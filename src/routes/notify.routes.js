import { Router } from "express";
import { sleepState } from "../controllers/notify.controller.js";
import { callMePlease } from "../controllers/notify.controller.js";
import { outdoor } from "../controllers/notify.controller.js";
import { location } from "../controllers/notify.controller.js";

const router = Router();

router.get("/sleep-state", sleepState);
router.get("/callMePlease", callMePlease);
router.get("/outdoor", outdoor);
router.get("/location", location);

export default router;
