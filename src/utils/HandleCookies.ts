import { Response, CookieOptions } from "express";
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
  sameSite: "none" as const,
};
const setCookies = (response: Response, cookieName: string, cookie: string) => {
  response.cookie(cookieName, cookie, cookieOptions);
};
export const clearCookie = (response: Response, cookieName: string) => {
  response.clearCookie(cookieName, cookieOptions);
};
export { setCookies, cookieOptions };
