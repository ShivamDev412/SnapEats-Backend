import jwt from "jsonwebtoken";
import { MESSAGES } from "./Constant";
import { InternalServerError } from "./Error";
const generateToken = (id: string) => {
  const { JWT_SECRET } = process.env;
  const token = jwt.sign({ id }, JWT_SECRET!, { expiresIn: "10m" });
  return token;
};
const createAuthToken = (id: string, email: string, storeId?: string) => {
  const { JWT_SECRET } = process.env;
  const payload = { id, email } as {
    id: string;
    email: string;
    storeId?: string;
  };
  if (storeId) {
    payload.storeId = storeId;
  }
  const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: "30m" });
  return token;
};
const createRefreshToken = (id: string) => {
  const { JWT_SECRET } = process.env;
  const token = jwt.sign({ id }, JWT_SECRET!, { expiresIn: "7d" });
  return token;
};
const verifyToken = (token: string) => {
  const { JWT_SECRET } = process.env;
  try {
    const decode = jwt.verify(token, JWT_SECRET!) as {
      id: string;
      email?: string;
      storeId?: string;
    };
    return decode;
  } catch (error) {
    throw new InternalServerError(MESSAGES.INVALID_TOKEN);
  }
};
export { createAuthToken, createRefreshToken, generateToken, verifyToken };
