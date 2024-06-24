import passport from "passport";
import axios from "axios";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import dotenv from "dotenv";
import { GITHUB_EMAIL_API } from "../utils/Constant";
dotenv.config();
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
  done(null, obj);
});
const PassportMiddleware = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      (token, tokenSecret, profile: Profile, done) => {
        return done(null, profile);
      }
    )
  );
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL!,
      },
      async (
        token: string,
        tokenSecret: string,
        profile: GitHubProfile,
        done: any
      ) => {
        const emailResponse = await axios.get(GITHUB_EMAIL_API, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        const emails = emailResponse.data;
        const primaryEmail =
          emails.find((email: { primary: boolean }) => email.primary)?.email ||
          null;
        profile.emails = [{ value: primaryEmail }];
        return done(null, profile);
      }
    )
  );
};
export default PassportMiddleware;
