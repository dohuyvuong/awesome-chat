import { validationResult } from "express-validator";

let getLoginRegister = (req, res) => {
  return res.render("auth/master");
};

let postRegister = (req, res) => {
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errorArr = validationErrors.errors.map(error => error.msg);

    console.log(errorArr);
    return;
  }

  console.log(req.body);
};

module.exports = {
  getLoginRegister,
  postRegister
};
