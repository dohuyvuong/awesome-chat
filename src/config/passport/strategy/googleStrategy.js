import passportGoogle from "passport-google-oauth";
import { UserModel } from "../../../models";
import { transErrors, transSuccess } from "../../../../lang/vi";

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;

let googleStrategy = new passportGoogle.OAuth2Strategy({
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
});

export default googleStrategy;
