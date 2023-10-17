import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import healhApi from "./api/health";
import aktivitetspliktRoutes from "./api/aktivitetspliktRoutes";
import bodyParser from "body-parser";
import logger, { pinoHttpMiddleware } from "./logger";
import config from "./config";
import createDependencies from "./deps";
import tokenValidation from "./middleware/token-validation";
import nivaa4Authentication from "./middleware/nivaa4-authentication";
import motebehovRoutes from "./api/motebehovRoutes";
import isdialogmoteRoutes from "./api/isdialogmoteRoutes";

dotenv.config();

const PORT = 3000;
const app = express();
const router = express.Router();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(pinoHttpMiddleware());
app.use(helmet());
app.use(cors({ origin: /\.nav\.no$/, credentials: true }));
app.disable("x-powered-by");

async function setUpRoutes() {
  const { tokenDings } = createDependencies();

  router.use(healhApi());
  router.use(tokenValidation);
  router.use(nivaa4Authentication);
  router.use(aktivitetspliktRoutes(await tokenDings));
  router.use(motebehovRoutes(await tokenDings));
  router.use(isdialogmoteRoutes(await tokenDings));

  app.use(config.BASE_PATH || "", router);
}

const startServer = async () => {
  try {
    await setUpRoutes();
    logger.info(`Starting server...`);
    app.listen(PORT, () => {
      logger.info("Server running at http://localhost:3000");
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

startServer();
