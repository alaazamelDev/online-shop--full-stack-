const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const Configs = require("./configs/configs");
const session = require("express-session");
const csurf = require("csurf");
const flash = require("connect-flash");

// Used to store sessions in MongoDB
const MongoDBStore = require("connect-mongodb-session")(session);

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images"),
  filename: (req, file, cb) => cb(null, uuidv4() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (
    ["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(
      file.mimetype
    )
  ) {
    return cb(null, true);
  }
  return cb(null, false);
};

const app = express();
const store = new MongoDBStore({
  uri: Configs.mongoDbConnectionString,
  collection: "sessions",
  databaseName: "shop",
});
const csurfProtection = csurf();

const errorsController = require("./controllers/errors-controller");

// Models Decleration
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret key",
    store: store, // change default MemoryStore to MongoDB Store
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      return next(new Error(err));
    });
});

// Support CSRF Protection middleware
app.use(csurfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// apply flash middleware
app.use(flash());

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);
app.use(errorsController.get500);

mongoose
  .connect(Configs.mongoDbConnectionString)
  .then((result) => {
    console.log("Connected");
    // app.listen(3000, "192.168.1.105");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
