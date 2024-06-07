import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import router from "./routers";
import { BASE_PATH } from "./utils/Endpoints";
import { MESSAGES } from "./utils/Constant";
import errorHandler from "./middlewares/Error.middleware";
// import socketAuthMiddleware from "./middlewares/SocketAuth.middleware";
import { setupSwagger } from "./swagger";
import { server, app } from "./utils/SocketInstance";
dotenv.config();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
const allowedOrigins = [
  process.env.CORS_ORIGIN_USER!,
  process.env.CORS_ORIGIN_ADMIN!,
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(BASE_PATH, router);
setupSwagger(app);

app.use(errorHandler);

server.listen(port, () => {
  console.clear();
  console.log(MESSAGES.SERVER_RUNNING(port));
});
