const mongoose = require("mongoose")
const commentSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  text: String,
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
  },
})
module.exports = mongoose.model("comments", commentSchema)
