const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const Place = require("../models/place")
const Comment = require("../models/comments")
const CheckedPlaceOwner = require("../utils/checkPlaceOwner")
const isLoggedIn = require("../utils/isLoggedin")

function isValidObjectId(req, res, next) {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next()
  } else {
    res.status(400).send("Invalid ID format")
  }
}

// GET all places
router.get("/", async (req, res) => {
  console.log(req.user)
  try {
    const places = await Place.find().exec()
    res.render("places", { places })
  } catch (err) {
    console.log(err)
    res.redirect("/places")
  }
})

// POST new place
router.post("/", isLoggedIn, async (req, res) => {
  try {
    const newPlace = {
      ...req.body,
      color: !!req.body.color,
      owner: {
        id: req.user._id,
        username: req.user.username,
      },
      upvotes: [req.user.username],
      downvotes: [],
    }
    const place = await Place.create(newPlace)
    req.flash("success", "Place Added Successfully")
    res.redirect("/places/" + place._id)
  } catch (err) {
    req.flash("error", "Error in Adding Places")
    res.redirect("/places/")
  }
})

// GET new place form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("new")
})

// GET search results
router.get("/search", async (req, res) => {
  try {
    const places = await Place.find({
      $text: {
        $search: req.query.term,
      },
    })
    res.render("places", { places })
  } catch (err) {
    console.log(err)
    res.send("Broken")
  }
})

// GET a single place by ID
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).exec()
    const commentRoute = await Comment.find({ placeId: req.params.id }).exec() // Fetch comments related to the place
    res.render("places_show", { place, commentRoute }) // Pass both place and comments to the template
  } catch (err) {
    console.log(err)
    res.send("Error fetching place")
  }
})

// Edit a place
router.get("/:id/edit", CheckedPlaceOwner, async (req, res) => {
  const place = await Place.findById(req.params.id).exec()
  res.render("place_edit", { place })
})

// Update a place
router.put("/:id", CheckedPlaceOwner, (req, res) => {
  const place = {
    ...req.body,
    color: !!req.body.color,
  }
  Place.findByIdAndUpdate(req.params.id, place, { new: true })
    .exec()
    .then((updatedPlace) => {
      req.flash("success", "Place updated")
      res.redirect(`/places/${req.params.id}`)
    })
    .catch((err) => {
      req.flash("error", "Error in updating")
      res.redirect("/places")
    })
})

// Vote route
router.post("/vote", isLoggedIn, async (req, res) => {
  console.log("Request body: ", req.body)

  try {
    const place = await Place.findById(req.body.placeId)
    const alreadyUpvoted = place.upvotes.indexOf(req.user.username)
    const alreadyDownvoted = place.downvotes.indexOf(req.user.username)

    let response = {}

    if (alreadyUpvoted === -1 && alreadyDownvoted === -1) {
      if (req.body.votetype === "up") {
        place.upvotes.push(req.user.username)
        await place.save() // Wait for the save operation to complete
        response = { message: "Upvote tallied", code: 1 }
      } else if (req.body.votetype === "down") {
        place.downvotes.push(req.user.username)
        await place.save() // Wait for the save operation to complete
        response = { message: "Downvote tallied", code: -1 }
      } else {
        response = { message: "Error 1", code: "err" }
      }
    } else if (alreadyUpvoted >= 0) {
      if (req.body.votetype === "up") {
        place.upvotes.splice(alreadyUpvoted, 1)
        await place.save() // Wait for the save operation to complete
        response = { message: "UpVote Removed", code: 0 }
      } else if (req.body.votetype === "down") {
        place.downvotes.push(req.user.username)
        await place.save() // Wait for the save operation to complete
        response = { message: "Changed to Downvote", code: -1 }
      } else {
        response = { message: "Error 2", code: "err" }
      }
    } else if (alreadyDownvoted >= 0) {
      if (req.body.votetype === "up") {
        place.downvotes.splice(alreadyDownvoted, 1)
        place.upvotes.push(req.user.username)
        await place.save() // Wait for the save operation to complete
        response = { message: "Changed to Upvote", code: 1 }
      } else if (req.body.votetype === "down") {
        place.downvotes.splice(alreadyDownvoted, 1)
        await place.save() // Wait for the save operation to complete
        response = { message: "Removed downvote", code: 0 }
      } else {
        response = { message: "Error 3", code: "err" }
      }
    } else {
      response = { message: "Error 4", code: "err" }
    }

    response.score = place.upvotes.length - place.downvotes.length
    res.json(response)
  } catch (err) {
    console.error("Error saving vote: ", err)
    res.status(500).json({ message: "Internal server error" })
  }
})

// DELETE a place
router.delete("/:id", CheckedPlaceOwner, (req, res) => {
  Place.findByIdAndDelete(req.params.id)
    .exec()
    .then((deletedPlace) => {
      req.flash("success", "Place Deleted")
      console.log("Deleted: ", deletedPlace)
      res.redirect("/places")
    })
    .catch((err) => {
      req.flash("error", "Error in Deleting place")
      res.redirect("back")
    })
})

module.exports = router
