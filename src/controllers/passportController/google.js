import passport from "passport";
import passportGoogle from "passport-google-oauth";
import { UserModel } from "../../models";
import { transErrors, transSuccess } from "../../../lang/vi";

let GoogleStrategy = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;

/**
 * Valid user account type: Google
 */
let init = () => {
  passport.use(new GoogleStrategy({
    clientID: ggAppId,
    clientSecret: ggAppSecret,
    callbackURL: ggCallbackUrl,
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByGoogleUid(profile.id);

      if (user) {
        return done(null, user, req.flash("success", transSuccess.login_successfully(user.username)));
      }

      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: { isActive: true },
        google: {
          uid: profile.id,
          token: profile.accessToken,
          email: profile.emails ? profile.emails[0].value : null,
        },
      };
      let newUser = await UserModel.createNew(newUserItem);

      return done(null, newUser, req.flash("success", transSuccess.login_successfully(newUser.username)));
    } catch (error) {
      return done(null, false, req.flash("errors", transErrors.server_error));
    }
  }));

  // Save userId to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // This is called by passport.session()
  // return userInfo to req.user
  passport.deserializeUser((id, done) => {
    UserModel.findUserById(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((error) => {
        return done(error, null);
      });
  });
};

export const GooglePassport = { init };
