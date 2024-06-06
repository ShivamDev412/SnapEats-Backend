import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import router from "./routers";
import { BASE_PATH } from "./utils/Endpoints";
import { MESSAGES, SOCKET_EVENT } from "./utils/Constant";
import errorHandler from "./middlewares/Error.middleware";
import { Server } from "socket.io";
import {createServer} from "http";
import socketAuthMiddleware from "./middlewares/SocketAuth.middleware";
import { setupSwagger } from "./swagger";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
const corsOptions = {
  origin: process.env.CORS_ORIGIN!,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(BASE_PATH, router);
setupSwagger(app);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN!,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

io.on(SOCKET_EVENT.CONNECTION, (socket) => {
  console.log("New client connected");
  console.log(socket.user);

  setInterval(() => {
    socket.emit(SOCKET_EVENT.NEW_STORE_REQUEST, {
      userName: "John Doe",
      storeName: "Store Name",
    });
  }, 5000);
  // socket.on(SOCKET_EVENT.DISCONNECT, () => {
  //   console.log("Client disconnected");
  // });
});

// server.on("request", app);

app.use(errorHandler);

server.listen(port, () => {
  console.clear();
  console.log(MESSAGES.SERVER_RUNNING(port));
});
