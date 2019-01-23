const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local");
const expressSession = require("express-session");
const methodOverride = require("method-override");
const { User } = require("./models");
//=================================================================
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
//=================================================================
// DATABASE CONFIGURATION
const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost/camps2";
mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("MONGO DB CONNECTED");
    // require("./seedDb")();
  })
  .catch(err => console.log("CAN NOT CONNECT DATABASE"));
//=================================================================
// PASSPORT CONFIGURATION
app.use(
  expressSession({
    secret: "rarey",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=================================================================
//  ROUTES  CONFIGURATION
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

const {
  userRoutes,
  campgroundRoutes,
  indexRoutes,
  commentRoutes
} = require("./routes");
app.use("/users", userRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:campgroundId", commentRoutes);
//=================================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVER STARTED AT ${PORT}`);
});
