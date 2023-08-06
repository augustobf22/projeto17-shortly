import { Router } from "express";
import { getMe } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get("/users/me", getMe);

export default usersRouter;
