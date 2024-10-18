const express = require("express")
const router = express.Router()
const Comment = require("../models/comments")
const Place = require("../models/place")
const isLoggedin = require("../utils/isLoggedin")
const checkCommentOwner = require("../utils/checkCommentOwner")

// Route to render new comment form
router.get("/places/:id/comments/new", isLoggedin, (req, res) => {
  res.render("comment_new", { placeId: req.params.id })
})

// Route to create a new comment
// Route to create a new comment
router.post("/places/:id/comments", isLoggedin, async (req, res) => {
  try {
    const newComment = await Comment.create({
      user: {
        id: req.user._id,
        username: req.user.username,
      },
      text: req.body.text,
      placeId: req.params.id, // Use req.params.id instead of req.params.placeId
    })
    req.flash("success", "Comment Added")
    res.redirect(`/places/${req.body.placeId}`)
  } catch (err) {
    req.flash("error", "Error in Adding Comment")
    res.redirect("/places")
  }
})

router.get(
  "/places/:id/comments/:commentId/edit",
  checkCommentOwner,
  async (req, res) => {
    try {
      const place = await Place.findById(req.params.id).exec()

      const comment = await Comment.findById(req.params.commentId).exec()
      res.render("comments_edit", { place, comment })
    } catch (err) {
      res.redirect("/places")
    }
  }
)

//Update

router.put(
  "/places/:id/comments/:commentId",
  checkCommentOwner,
  async (req, res) => {
    try {
      const comment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
          text: req.body.text,
        },
        { new: true }
      )
      req.flash("success", "Comment Edited")
      res.redirect(`/places/${req.params.id}`)
    } catch (err) {
      req.flash("error", "Erro in Edit Comment")
      res.redirect("/places")
    }
  }
)

//Delete
router.delete(
  "/places/:id/comments/:commentId",
  checkCommentOwner,
  async (req, res) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.commentId)
      req.flash("succes", "Comment Deleted")
      res.redirect(`/places/${req.params.id}`)
    } catch (err) {
      req.flash("error", "Erro in Deleting Comment")
      res.redirect("/places")
    }
  }
)

module.exports = router
