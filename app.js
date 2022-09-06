const path = require("path");
const mongoose = require("mongoose");
const Configs = require("./configs/configs");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const errorsController = require("./controllers/errors-controller");

// Models Decleration
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// pass user object through requests
app.use((req, res, next) => {
  User.findById("631733eb038bf1f296c9102c")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

mongoose
  .connect(Configs.mongoDbConnectionString)
  .then((result) => {
    console.log("Connected");
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          email: "alaa@test.com",
          name: "Alaa",
          cart: { items: [] },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
