import jwt from "jsonwebtoken";
import { MESSAGES } from "./Constant";
import { InternalServerError } from "./Error";
const generateToken = (id: string) => {
  const { JWT_SECRET } = process.env;
  const token = jwt.sign({ id }, JWT_SECRET!, { expiresIn: "1h" });
  return token;
};
const createAuthToken = (id: string, email: string) => {
  const { JWT_SECRET } = process.env;
  const token = jwt.sign({ id, email }, JWT_SECRET!, { expiresIn: "1h" });
  return token;
};
const createRefreshToken = (id: string) => {
  const { JWT_SECRET } = process.env;
  const token = jwt.sign({ id }, JWT_SECRET!, { expiresIn: "7d" });
  return token;
};
const verifyToken = (token: string): string => {
  const { JWT_SECRET } = process.env;
  try {
    const decode = jwt.verify(token, JWT_SECRET!) as {
      id: string;
      email?: string;
    };
    return decode.id;
  } catch (error) {
    throw new InternalServerError(MESSAGES.INVALID_TOKEN);
  }
};
export { createAuthToken, createRefreshToken, generateToken, verifyToken };
