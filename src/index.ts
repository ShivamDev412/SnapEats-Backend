import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import compression from "compression";
import router from "./routers";
import { BASE_PATH } from "./utils/Endpoints";
import { MESSAGES } from "./utils/Constant";
import errorHandler from "./middlewares/Error.middleware";
// import socketAuthMiddleware from "./middlewares/SocketAuth.middleware";
import { setupSwagger } from "./swagger";
import { server, app } from "./utils/SocketInstance";
import PassportMiddleware from "./middlewares/Passport.middleware";
dotenv.config();

const port = process.env.PORT || 4000;
app.use(
  session({
    name: "sid",
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

const allowedOrigins = [
  process.env.CORS_ORIGIN_USER!,
  process.env.CORS_ORIGIN_ADMIN!,
  // process.env.CORS_ORIGIN_STORE_URL!,
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(compression());
PassportMiddleware()
app.use(BASE_PATH, router);
setupSwagger(app);

app.use(errorHandler);

server.listen(port, () => {
  console.clear();
  console.log(MESSAGES.SERVER_RUNNING(port));
});
