const express = require("express")
const router = express.Router()
const isLoggedin = require("../utils/isLoggedin")
router.get("/", (req, res) => {
  res.render("landing")
})
router.get("/account", isLoggedin, (req, res) => {
  res.render("account")
})

module.exports = router
