const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/userModel.js");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.MONGO_ATLAS_URL || "";

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

async function main() {
  await mongoose.connect(dbURL);
  console.log("Connected to MongoDB");
}
main().catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.send("Main Page");
// });

//! Mongo Store Session
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.error("MongoDB session store error", err);
});

//! Session Manager
const sessionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

//! Listing Router
app.use("/listings", listingsRouter);

//! Review Router
app.use("/listings/:id/reviews", reviewsRouter);

//! User Router
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

//! Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error" } = err;
  res
    .status(statusCode)
    .render("error.ejs", { message: message, statusCode: statusCode });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
