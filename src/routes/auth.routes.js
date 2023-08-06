import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { schemaSignUp, schemaSignIn } from "../schemas/auth.schema.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(schemaSignUp), signUp);
authRouter.post("/signin", validateSchema(schemaSignIn), signIn);

export default authRouter;
