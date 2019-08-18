import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "../../models/userModel";
import { transErrors, transSuccess } from "../../../lang/vi";

let FacebookStrategy = passportFacebook.Strategy;

let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbCallbackUrl = process.env.FB_CALLBACK_URL;

/**
 * Valid user account type: Facebook
 */
let initPassportFacebook = () => {
  passport.use(new FacebookStrategy({
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbCallbackUrl,
    profileFields: ["email", "gender", "displayName"],
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByFacebookUid(profile.id);

      if (user) {
        return done(null, user, req.flash("success", transSuccess.login_successfully(user.username)));
      }

      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: { isActive: true },
        facebook: {
          uid: profile.id,
          token: profile.accessToken,
          email: profile.emails ? profile.emails[0].value : null,
        },
      };
      let newUser = await UserModel.createNew(newUserItem);

      return done(null, newUser, req.flash("success", transSuccess.login_successfully(newUser.username)));
    } catch (error) {
      console.log(error);
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

module.exports = initPassportFacebook;
