import jwt from "jsonwebtoken";

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
export { createAuthToken, createRefreshToken };
