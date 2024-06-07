import { Server } from "socket.io";
import express from "express";
import http from "http";
import socketAuthMiddleware from "../middlewares/SocketAuth.middleware";
import { SOCKET_EVENT } from "./Constant";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_ORIGIN_USER!, process.env.CORS_ORIGIN_ADMIN!],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// io.use(socketAuthMiddleware);
io.on(SOCKET_EVENT.CONNECTION, (socket) => {
  console.log("NEW CLIENT CONNECTED " + socket.id);
  socket.on(SOCKET_EVENT.DISCONNECT, () => {
    console.log("CLIENT DISCONNECTED " + socket.id);
  });
});
export { io, server, app};
