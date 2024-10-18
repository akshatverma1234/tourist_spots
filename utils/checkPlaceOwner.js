const Place = require("../models/place")

const checkPlaceOwner = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const place = await Place.findById(req.params.id).exec()
    if (place.owner.id.equals(req.user._id)) {
      next()
    } else {
      req.flash("You don't have the permission")
      res.redirect("back")
    }
  } else {
    req.flash("You must logged in to do that")
    res.redirect("/login")
  }
}

module.exports = checkPlaceOwner
