import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { AuthError } from "../utils/Error";
import { AuthPayload } from "./Auth.middleware";
import { verifyToken } from "../utils/GenerateToken";
declare module "socket.io" {
  interface Socket {
    user?: AuthPayload;
  }
}
const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = verifyToken(token);
      socket.user = decoded as AuthPayload;
      next();
    } catch (error) {
      next(new AuthError("Authentication error"));
    }
  } else {
    next(new AuthError("Authentication error"));
  }
};

export default socketAuthMiddleware;
