const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config(); // For .env files

const HttpError = require("./models/http-error");
const productsRoutes = require("./routes/products-routes");
const usersRoutes = require("./routes/users-routes");
const categoriesRoutes = require("./routes/categories-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/products", productsRoutes); // => api/products/...
app.use("/api/users", usersRoutes); // => api/users/...
app.use("/api/cats", categoriesRoutes); // => api/categories/...

// Undefined Routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  return next(error);
});

// Handling other errors
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!." });
});


// FROM .env
const port = process.env.PORT || 5000
const database = process.env.DATABASE;
mongoose
  .connect(
    database
  )
  .then(() => {
    app.listen(port);
  })
  .catch((error) => console.log("Connection Failed!", error));
