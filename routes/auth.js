const express = require("express")
const router = express.Router()
const User = require("../models/user")
const passport = require("passport")

router.get("/signup", (req, res) => {
  res.render("signup")
})
router.post("/signup", async (req, res) => {
  try {
    const newUser = await User.register(
      new User({
        username: req.body.username,
        email: req.body.email,
      }),
      req.body.password
    )
    // Set flash message
    req.flash("success", `You signed up as ${newUser.username}`)

    // Authenticate and redirect manually
    req.login(newUser, function (err) {
      if (err) {
        req.flash("error", "Error during login after signup.")
        return res.redirect("/signup")
      }
      res.redirect("/places")
    })
  } catch (err) {
    req.flash("error", "Signup failed. Please try again.")
    res.redirect("/signup")
  }
})

router.get("/login", (req, res) => {
  res.render("login")
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Logged in Successfull!",
  })
)
router.get("/logout", (req, res, next) => {
  req.logout()
  req.flash("success", "Logout Successfully")
  res.redirect("/places")
})

module.exports = router
