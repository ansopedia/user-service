import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envConstants } from "@/constants";
import { UserService } from "@/api/v1/user/user.service";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserService.getUserByGoogleId(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: envConstants.GOOGLE_CLIENT_ID!,
      clientSecret: envConstants.GOOGLE_CLIENT_SECRET,
      callbackURL: envConstants.GOOGLE_CLIENT_URL,
    },
    async (_, __, profile, cb) => {
      return cb(null, profile);
    }
  )
);
