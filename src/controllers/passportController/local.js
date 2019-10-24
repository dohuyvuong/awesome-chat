import passport from "passport";
import passportLocal from "passport-local";
import { UserModel } from "../../models";
import { transErrors, transSuccess } from "../../../lang/vi";

let LocalStrategy = passportLocal.Strategy;

/**
 * Valid user account type: local
 */
let init = () => {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  }, async (req, email, password, done) => {
    try {
      let user = await UserModel.findByEmail(email);

      if (!user) {
        return done(null, false, req.flash("errors", transErrors.login_failed));
      }
      if (!user.local.isActive) {
        return done(null, false, req.flash("errors", transErrors.account_email_is_exist_but_not_active));
      }
      if (user.deletedAt) {
        return done(null, false, req.flash("errors", transErrors.account_email_is_exist_but_disabled));
      }

      let checkPassword = await user.comparePassword(password);
      if (!checkPassword) {
        return done(null, false, req.flash("errors", transErrors.login_failed));
      }

      return done(null, user, req.flash("success", transSuccess.login_successfully(user.username)));
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

export const LocalPassport = { init };
