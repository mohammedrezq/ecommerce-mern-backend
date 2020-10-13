const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");


/* Get Order (Link) by order Id */

const getOrderById = async (req, res, next) => {
  const orderId = req.params.oid; // { oid: "5f82c63fa4c72a60646563dc" } example

  console.log(orderId);
  let order;
  try {
    order = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError(
      "Could not find any orders for the provided ID",
      500
    );
    return next(error);
  }
  console.log(order)

  if (!order || order.length === 0) {
    const error = new HttpError("Could not find a order for that ID.", 404);
    return next(error);
  }

  res.json({ order: order.toObject({ getters: true }) }); // => {order} => {order: order}
};

/* Get List of all Orders */

const getAllOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await Order.find();
  } catch (err) {
    const error = new HttpError(
      "Could not fetch any orders, please try again in few moments",
      404
    );
    return next(error);
  }

  if (orders.length === 0) {
    const error = new HttpError("Could not fetch any orders.", 422);
    return next(error);
  }

  res.json({
    orders: orders.map((order) => order.toObject({ getters: true })),
  });
};

/* Get Order (Link) by user Id (userID) */

const getOrdersByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let orders;
  try {
    orders = await Order.find({ User: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching orders failed for the provided user ID, please try again in few moments.",
      500
    );
    return next(error);
  }

  if (!orders || orders.length === 0) {
    const error = new HttpError(
      "Could not find any orders for the provided user ID.",
      404
    );
    return next(error);
  }

  res.json({
    orders: orders.map((order) => order.toObject({ getters: true })),
  }); // => {user} => {user: user}
};

/* Make an Order */
const makeAnOrder = async (req, res, next) => {
  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs

  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed please check the data again.",
      422
    );
    return next(error);
  }

  const {  orderItems, ShippingAddress, paymentMethod, paymentResult, taxPrice, shippingPrice  } = req.body;
  console.log(req.body);
  // const orderItems = req.body.orderItems;

  const makeOrder = new Order({
     orderItems, ShippingAddress, paymentMethod, paymentResult, taxPrice, shippingPrice
  });

  let order;
  try {
    
    order = await makeOrder.save(); // save the order made
 
  } catch (err) {
    const error = new HttpError(
      "Creating order failed, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ order: order });
};

/* Update AN Order */
const updateAnOrder = async (req, res, next) => {
  
  const errors = validationResult(req); // Part of express-validator to check valiadtion for inputs
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Update Failed due to invalid inputs please check the data in the input fields again.",
      422
      );
      return next(error);
    }
    
    const {  orderItems, ShippingAddress, paymentMethod, paymentResult, taxPrice, shippingPrice  } = req.body;
    
    const orderId = req.params.oid;

    console.log(orderId)

    let order;

  try {
    order = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update order.",
      500
    );
    return next(error);
  }

  order.orderItems = orderItems;
  order.ShippingAddress = ShippingAddress;
  order.paymentMethod = paymentMethod;
  order.paymentResult = paymentResult;
  order.taxPrice = taxPrice;
  order.shippingPrice = shippingPrice;

  let UpdatedOrder;
  try {
    UpdatedOrder = await order.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the orders",
      500
    );
    return next(error);
  }

  res.status(200).json({
    order: UpdatedOrder,
    message: "Order Successfully Updated",
  });
};

/* Delete (REMOVE) Order */
const deleteAnOrder = async (req, res, next) => {
  const orderId = req.params.oid;

  let order;

  try {
    order = await Order.findById(orderId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the order. try again in few moments",
      500
    );
    return next(error);
  }
  if (!order) {
    const error = new HttpError("Could not find a product for this ID", 500);
    return next(error);
  }

  // Removing Order 
  try {

    await order.remove(); // remove order

  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the order. try again in few moments",
      404
    );
    return next(error);
  }

  res.status(200).json({ message: "Order Successfully Deleted" });
};

exports.getOrderById = getOrderById;
exports.getAllOrders = getAllOrders;
exports.getOrdersByUserId = getOrdersByUserId;
exports.makeAnOrder = makeAnOrder;
exports.updateAnOrder = updateAnOrder;
exports.deleteAnOrder = deleteAnOrder;
