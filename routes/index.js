import { Router } from "express";
import route from "./route/index.js";

const router = Router();

router.use("/route", route); // base route

export default router;
