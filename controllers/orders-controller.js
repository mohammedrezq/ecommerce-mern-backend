const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const generateToken = require("../utils/generateToken");

/* Get Order (Link) by order Id */

const getOrderById = async (req, res, next) => {
  const orderId = req.params.oid; // { oid: "5f82c63fa4c72a60646563dc" } example

  // console.log(orderId);
  let order;
  try {
    order = await Order.findById(orderId).populate(
      "user",
      "firstName lastName email"
    ); // populate user info from USER Model
  } catch (err) {
    const error = new HttpError(
      "Could not find any orders for the provided ID",
      500
    );
    return next(error);
  }
  // console.log(order);

  if (!order || order.length === 0) {
    const error = new HttpError("Could not find a order for that ID.", 404);
    return next(error);
  }

  res.json(order.toObject({ getters: true })); // => {order} => {order: order}
};

/* Get List of all Orders */

const getAllOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await Order.find({}).populate("User", "id");
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

  res.json( orders.map((order) => order.toObject({ getters: true })) );
};

/* Get Order (Link) by user Id (userID) */

// const getOrdersByUserId = async (req, res, next) => {
//   const userId = req.params.uid;

//   let orders;
//   try {
//     orders = await Order.find({ User: userId });
//   } catch (err) {
//     const error = new HttpError(
//       "Fetching orders failed for the provided user ID, please try again in few moments.",
//       500
//     );
//     return next(error);
//   }

//   if (!orders || orders.length === 0) {
//     const error = new HttpError(
//       "Could not find any orders for the provided user ID.",
//       404
//     );
//     return next(error);
//   }

//   res.json({
//     orders: orders.map((order) => order.toObject({ getters: true })),
//   }); // => {user} => {user: user}
// };

/* Make an Order */
const makeAnOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    const error = new HttpError("No order items", 400);
    return next(error);
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    try {
      const createdOrder = await order.save(); // save the order made
      res.status(201).json(createdOrder);
    } catch(err) {
      const error = new HttpError("Could not make this order, please try again", 404);
      return next(error);
    }
  }

  // let order;
  // try {
  //   order = await createdOrder.save(); // save the order made
  // } catch (err) {
  //   const error = new HttpError("Creating order failed, please try again", 500);
  //   return next(error);
  // }

  // res.status(201).json(order);
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

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult,
    taxPrice,
    shippingPrice,
  } = req.body;

  const orderId = req.params.oid;

  console.log(orderId);

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
  order.shippingAddress = shippingAddress;
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

/* Update an Order to Paid (make paid true instead of false) */

const updateOrderToPaid = async (req, res, next) => {
  let order;
  try {
    order = await Order.findById(req.params.id);
  } catch (err) {
    const error = new HttpError("Order Issue", 500);
    return next(error);
  }

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      // from paypal
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // console.log(order.paymentResult);
    const updatedOrder = await order.save();
    // console.log(updatedOrder);
    res.json(updatedOrder);
  } else {
    const error = new HttpError("Order Not Found", 404);
    return next(error);
  }
};

/* Update an Order to Delivered (make paid true instead of false) */

const updateOrderToDelivered = async (req, res, next) => {
  let order;
  try {
    order = await Order.findById(req.params.id);
  } catch (err) {
    const error = new HttpError("Order Issue", 500);
    return next(error);
  }

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    const error = new HttpError("Order Not Found", 404);
    return next(error);
  }
};


/* Get Order (Link) by user Id (userID) Logged in User */

const getOrdersByUser = async (req, res, next) => {
  const userId = req.user._id;

  let orders;
  try {
    orders = await Order.find({ user: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching orders failed, please try again in few moments.",
      500
    );
    return next(error);
  }

  // if (!orders || orders.length === 0) {
  //   const error = new HttpError(
  //     "Could not find any orders user.",
  //     404
  //   );
  //   return next(error);
  // }

  res.json(
    orders = orders.map((order) => order.toObject({ getters: true })),
  ); // => {user} => {user: user}
};

exports.getOrderById = getOrderById;
exports.getAllOrders = getAllOrders;
exports.getOrdersByUser = getOrdersByUser;
exports.makeAnOrder = makeAnOrder;
exports.updateAnOrder = updateAnOrder;
exports.deleteAnOrder = deleteAnOrder;
exports.updateOrderToPaid = updateOrderToPaid;
exports.updateOrderToDelivered = updateOrderToDelivered;
