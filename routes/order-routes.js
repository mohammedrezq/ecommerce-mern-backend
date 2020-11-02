const express = require("express");
const { check } = require("express-validator");

const ordersController = require("../controllers/orders-controller");
const protect = require("../middleware/authMiddleware");

const router = express.Router(); // const { Router } = require('express');

/* Get Product (Link) by product Id */

router.get("/:oid", ordersController.getOrderById);

/* Get List of all products */

router.get("/", ordersController.getAllOrders);

/* Get Product (Link) by user Id (productCreator id) */

router.get("/user/:uid", ordersController.getOrdersByUserId);

/* Create New Product */

router.post(
  "/",
  // [
    // check("orderItems").not().isEmpty(),
    // check("ShippingAddress").not().isEmpty(),
    // check("paymentMethod").not().isEmpty(),
    // check("paymentResult").not().isEmpty(),
    // check("taxPrice").not().isEmpty(),
    // check("shippingPrice").not().isEmpty(),
    // check("totalPrice").not().isEmpty(),
  // ],
  protect,
  ordersController.makeAnOrder
);

/* Update Product */

router.patch(
  "/:oid",
  [
    check("orderItems").not().isEmpty(),
    check("ShippingAddress").not().isEmpty(),
    check("paymentMethod").not().isEmpty(),
    check("paymentResult").not().isEmpty(),
    check("taxPrice").not().isEmpty(),
    check("shippingPrice").not().isEmpty(),
    check("totalPrice").not().isEmpty(),
  ],
  ordersController.updateAnOrder
);

/* Delete (REMOVE) Product */

router.delete("/:oid", ordersController.deleteAnOrder);

module.exports = router;
