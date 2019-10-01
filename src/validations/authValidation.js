import { check } from "express-validator";
import { transValidation } from "../../lang/vi";

let register = [
  check("email", transValidation.email_invalid)
    .isEmail()
    .trim(),
  check("gender", transValidation.gender_invalid)
    .isIn(["male", "female"]),
  check("password", transValidation.password_invalid)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("password_confirmation", transValidation.password_confirmation_incorrect)
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
];

module.exports = {
  register,
};
