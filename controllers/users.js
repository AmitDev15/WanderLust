const User = require("../models/userModel");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.userSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const newUserRegistered = await User.register(newUser, password);
    req.session.userId = newUser._id;
    req.login(newUserRegistered, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome ${newUser.username} to WanderLust Inc.`);
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.userLogin = async (req, res) => {
  req.flash("success", `Welcome back ${req.user.username} to WanderLust Inc.`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have successfully logged out");
    res.redirect("/listings");
  });
};
