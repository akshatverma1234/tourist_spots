const mongoose = require("mongoose")
const placesSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  city: String,
  author: String,
  date: Date,
  rating: Number,
  tags: String,
  color: Boolean,
  image: String,
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  upvotes: [String],
  downvotes: [String],
})

placesSchema.index({
  "$**": "text",
})
const Place = mongoose.model("place", placesSchema)

module.exports = Place
