let getLoginRegister = (req, res) => {
  return res.render("auth/master");
};

let getLogout = (req, res) => {
  return res.send("Logout");
};

module.exports = {
  getLoginRegister,
  getLogout
};
