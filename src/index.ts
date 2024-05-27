import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import router from "./routers";
import { BASE_PATH } from "./utils/Endpoints";
import { MESSAGES } from "./utils/Constant";
import errorHandler from "./middlewares/Error.middleware";
import { setupSwagger } from "./swagger";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(compression());
const corsOptions = {
  origin: process.env.CORS_ORIGIN!,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(BASE_PATH, router);
setupSwagger(app);
app.use(errorHandler);
app.listen(port, () => {
  console.log(MESSAGES.SERVER_RUNNING(port));
});
