import { Server } from "socket.io";
import http from "http";
import socketAuthMiddleware from "../middlewares/SocketAuth.middleware";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN!,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("New client connected", socket.user);

  socket.onAny((event, data) => {
    console.log(`Received event: ${event}`);
    io.emit(event, data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

export default io;
export { server };
