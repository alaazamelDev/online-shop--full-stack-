const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const { mongoConnect } = require("./util/database");

const app = express();

const errorsController = require("./controllers/errors-controller");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// pass user object through requests
app.use((req, res, next) => {
  // User.findByPk(1)
  //     .then(user => {
  //         req.user = user;
  next();
  //     })
  //     .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

mongoConnect(() => {
  console.log("Connected");
  app.listen(3000);
});
