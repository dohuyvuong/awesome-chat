let getLoginRegister = (req, res) => {
  return res.render("auth/loginRegister");
};

let getLogout = (req, res) => {
  return res.send("Logout");
};

module.exports = {
  getLoginRegister,
  getLogout
};
