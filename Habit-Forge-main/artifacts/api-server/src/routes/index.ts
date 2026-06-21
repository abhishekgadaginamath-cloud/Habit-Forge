import { Router, type IRouter } from "express";
import healthRouter from "./health";
import userRouter from "./user";
import habitsRouter from "./habits";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(userRouter);
router.use(habitsRouter);
router.use(analyticsRouter);

export default router;
