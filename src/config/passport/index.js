import passport from "passport";
import { facebookStrategy, googleStrategy, localStrategy } from "./strategy";
import { UserModel } from "../../models";

/**
 * Initialize passport
 * @param {passport.PassportStatic} passport Default imported from passport module
 */
let initPassport = (passport) => {
  passport.use(facebookStrategy);
  passport.use(googleStrategy);
  passport.use(localStrategy);

  // Save userId to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // This is called by passport.session()
  // return userInfo to req.user
  passport.deserializeUser((id, done) => {
    UserModel.findUserById(id)
      .then((user) => {
        return done(null, user.toObject());
      })
      .catch((error) => {
        return done(error, null);
      });
  });
};

export default initPassport;
