// utils/isLoggedin.js

const isLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash("error", "You must be logged in to view this page")
    res.redirect("/login")
  }
}

module.exports = isLogin
