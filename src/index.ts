// index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import compression from "compression";
import router from "./routers";
import http from "http";
import { BASE_PATH } from "./utils/Endpoints";
import { MESSAGES, SOCKET_EVENT } from "./utils/Constant";
import errorHandler from "./middlewares/Error.middleware";
import { setupSwagger } from "./swagger";
import PassportMiddleware from "./middlewares/Passport.middleware";

dotenv.config();
const app = express();
const server = http.createServer(app);
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
// app.use(morgan("combined"));
app.use(cookieParser());
app.use(compression());

PassportMiddleware();

app.use(BASE_PATH, router);
setupSwagger(app);
app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.on(SOCKET_EVENT.CONNECTION, (socket) => {
  console.log("A user got connected:", socket.id);

  socket.on(SOCKET_EVENT.DISCONNECT, () => {
    console.log("User disconnected:", socket.id);
  });
});
server.listen(port, () => {
  console.clear();
  console.log(MESSAGES.SERVER_RUNNING(port));
});
export { io };
