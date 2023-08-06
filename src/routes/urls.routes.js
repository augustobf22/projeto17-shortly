import { Router } from "express";
import { postShorten, getUrlsById, getShortUrl, deleteUrlById, getRanking } from "../controllers/urls.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { schemaUrl} from "../schemas/urls.schema.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateSchema(schemaUrl), postShorten);
urlsRouter.get("/urls/:id", getUrlsById);
urlsRouter.get("/urls/open/:shortUrl", getShortUrl);
urlsRouter.delete("/urls/:id", deleteUrlById);
urlsRouter.get("/ranking", getRanking);

export default urlsRouter;
