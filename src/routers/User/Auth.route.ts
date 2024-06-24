import express from "express";
import multer from "multer";
import passport from "passport";
import { ENDPOINTS } from "../../utils/Endpoints";
import AuthController from "../../controllers/User/Auth.controller";
const routes = express.Router();
const authController = new AuthController();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");
routes.post(ENDPOINTS.LOGIN, authController.login);
routes.post(ENDPOINTS.SIGNUP, upload, authController.signup);
routes.get(ENDPOINTS.REFRESH_TOKEN, authController.refreshToken);
routes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

routes.get(
  ENDPOINTS.GOOGLE_AUTH_CALLBACK,
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.socialAuthCallback
);
routes.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
routes.get(
  ENDPOINTS.GITHUB_AUTH_CALLBACK,
  passport.authenticate("github", { failureRedirect: "/login" }),
  authController.socialAuthCallback
);

export default routes;
