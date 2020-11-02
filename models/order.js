const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    orderItems: [{
        title: {type: String, required: true},
        qty: {type: Number, required: true},
        image: {type: String, required: true},
        size: {type: String, required: true},
        price: {type: Number, required: true},
        product: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product"},
    }
    ],
    shippingAddress:{
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        Address: { type: String, required: true },
        City: { type: String, required: true },
        PostalCode: { type: String, required: true },
        Country: { type: String, required: true },
        Email: { type: String, required: true },
        PhoneNumber: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true},
    paymentResult: {  // From Paypal
        id: { type: String},
        status: { type: String},
        update_time: { type: String},
        email_address: { type: String},
    } ,
    itemsPrice: { type: String, required: true, default: "0.00" },
    taxPrice: { type: String, required: true, default: "0.00" },
    shippingPrice: { type: String, required: true, default: "0.00" },
    totalPrice: { type: String, required: true, default: "0.00" },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema);