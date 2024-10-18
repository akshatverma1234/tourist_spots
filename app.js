// NPM Imports
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const flash = require("connect-flash")
const methodOverride = require("method-override")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const expressSessions = require("express-session")

// Module Routes
const comicroute = require("./routes/placeRoute")
const commentroute = require("./routes/commentRoute")
const mainroute = require("./routes/mainRoute")
const errorroute = require("./routes/errorRoute")
const authRoute = require("./routes/auth")

// User Model
const User = require("./models/user")

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/yelp_comics", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// EJS View Engine
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// Session Configuration
app.use(
  expressSessions({
    secret: "mjdnjdnfjnaekfmkdsmskds",
    resave: false,
    saveUninitialized: false,
  })
)

// Flash Middleware
app.use(flash())

// Passport Configuration
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.errorMessage = req.flash("error")
  res.locals.successMessage = req.flash("success")
  next()
})

// Routes Section
app.use("/", mainroute) // Main Route
app.use("/", authRoute) // Authentication Routes
app.use("/places", comicroute) // Places (Comics) Route
app.use(commentroute) // Comments Route
app.use(errorroute) // Error Route

// Start the Server
app.listen(3000, () => {
  console.log("Listening on port 3000")
})
