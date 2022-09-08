// /login => GET
exports.getLogin = (req, res, next) => {
  console.log(req.session);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

// /login => POST
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  console.log("Object: ", req.user);
  req.session.user = req.user;
  req.session.save((err) => {
    res.redirect("/");
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
