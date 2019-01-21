const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//=================================================================
app.use(bodyParser.urlencoded({ extended: true }));
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
//  ROUTES  CONFIGURATION
const campgrounds = require("./routes/campground-routes.js");
const indexRoutes = require("./routes/index-routes.js");
app.use("/", indexRoutes);
app.use("/campgrounds", campgrounds);
//=================================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVER STARTED AT ${PORT}`);
});
