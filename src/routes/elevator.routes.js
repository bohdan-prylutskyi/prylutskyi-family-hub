import { Router } from "express";
import { status } from "../controllers/elevator.controller.js";

const router = Router();

router.get("/status", status);

export default router;
