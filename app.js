const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const colors = require("colors");
const mongoose = require("mongoose");
var morgan = require('morgan')

require("dotenv").config(); // For .env files

const HttpError = require("./models/http-error");
/* Routes */
const productsRoutes = require("./routes/products-routes");
const usersRoutes = require("./routes/users-routes");
const categoriesRoutes = require("./routes/categories-routes");
const categoriesUsersRoutes = require("./routes/categories-users-routes");
const orderRoutes = require("./routes/order-routes");
const uploadRoutes = require("./routes/upload-routes");

const app = express();

app.use(bodyParser.json());

// app.use(morgan())

// CORS HEADERS
app.use((req, res, next ) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
})

app.use("/api/products", productsRoutes); // => api/products/...
app.use("/api/users", usersRoutes); // => api/users/...
app.use("/api/cats", categoriesRoutes); // => api/cats/... (For Admin)
app.use("/api/categories", categoriesUsersRoutes); // => api/categories/... (For Users)
app.use("/api/orders", orderRoutes); // => api/orders/...
app.use("/api/uploads", uploadRoutes); // => api/orders/...

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))
console.log(process.env.PAYPAL_CLIENT_ID);

// const __dirname = path.reslove()
app.use("./uploads", express.static(path.join(path.resolve(), "./uploads")))

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
const port = process.env.PORT || 5000;
const database = process.env.DATABASE;

try {
  mongoose
    .connect(database, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => {
      app.listen(port);
    })
} catch (err) {
  console.log(`Connection failed: ${err}`.red.underline);
}
