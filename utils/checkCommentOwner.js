const Comment = require("../models/comments")

const checkCommentOwner = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const comment = await Comment.findById(req.params.commentId).exec()
    if (comment.user.id.equals(req.user._id)) {
      next()
    } else {
      req.flash("error", "You don't have the permission")
      res.redirect("back")
    }
  } else {
    req.flash("You must logged in")
    res.redirect("/login")
  }
}

module.exports = checkCommentOwner
