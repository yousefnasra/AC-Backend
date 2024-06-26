import { Cart } from "../../../DB/models/cart.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { clearCart, updateStock } from "./order.service.js";
import Stripe from "stripe";

export const createOrder = asyncHandler(async (req, res, next) => {
    // data from request
    const { phone, address, coupon, payment } = req.body;
    // check coupon
    let checkCoupon;
    if (coupon) {
        checkCoupon = await Coupon.findOne({
            name: coupon,
            expiredAt: { $gt: Date.now() }
        });
        if (!checkCoupon) return next(new Error("invalid coupon!", { cause: 400 }));
    };
    // get products from cart
    const cart = await Cart.findOne({ user: req.user._id });
    const products = cart.products;
    if (products.length < 1) return next(new Error("empty cart!", { cause: 400 }));
    // check products
    let orderProducts = [];
    let orderPrice = 0;
    for (let i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].productId);
        // check product existence
        if (!product)
            return next(new Error(`${products[i].productId} product not found!`, { cause: 404 }));
        // check product in stock
        if (!product.inStock(products[i].quantity))
            return next(new Error(`product out of stock, only ${product.availableItems} are available!`, { cause: 400 }));
        orderProducts.push({
            name: product.name,
            quantity: products[i].quantity,
            itemPrice: product.finalPrice,
            totalPrice: product.finalPrice * products[i].quantity,
            productId: product._id,
        });
        orderPrice += product.finalPrice * products[i].quantity;
    };
    // create order in db
    const order = await Order.create({
        user: req.user._id,
        address,
        payment,
        phone,
        products: orderProducts,
        price: orderPrice,
        coupon: {
            id: checkCoupon?._id,
            name: checkCoupon?.name,
            discount: checkCoupon?.discount,
        },
    });
    if (payment === "cash") {
        // update stock
        updateStock(order.products, true);
        // clear cart
        clearCart(req.user._id);
    }
    // check if payment = visa
    if (payment === 'visa') {
        // stripe gateway
        const stripe = new Stripe(process.env.STRIPE_KEY);
        // coupon stripe
        let couponExisted;
        if (order.coupon.name !== undefined) {
            couponExisted = await stripe.coupons.create({
                percent_off: order.coupon.discount,
                duration: 'once',
            });
        };
        // create stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            metadata: { order_id: order._id.toString() },
            mode: "payment",
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
            line_items: order.products.map((product) => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: product.name,
                            // images: [product.productId.defaultImage.url],
                        },
                        unit_amount: product.itemPrice * 100,
                    },
                    quantity: product.quantity,
                };
            }),
            discounts: couponExisted ? [{ coupon: couponExisted.id }] : [],
        });
        // send response
        return res.json({ success: true, results: { url: session.url } });
    };
    // send response
    return res.status(201).json({ success: true, results: { order } });
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
    // check order
    const order = await Order.findById(req.params.id);
    if (!order) return next(new Error("invalid order id!", { cause: 400 }));
    // check order owner 
    if (order.user.toString() !== req.user._id.toString()) return next(new Error("not authorized!", { cause: 401 }));
    // check status
    if (order.status !== "placed")
        return next(new Error("can not cancel the order!", { cause: 400 }));
    // cancel order
    order.status = "canceled";
    await order.save();
    // update stock
    updateStock(order.products, false);
    // send response
    return res.json({ success: true, message: "order canceled successfully!" })
});

// webhook
export const orderWebhook = asyncHandler(async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_KEY);
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.ENDPOINT_SECRET);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    const orderId = event.data.object.metadata.order_id;
    if (event.type === "checkout.session.completed") {
        // change order status
        const order = await Order.findOneAndUpdate({ _id: orderId }, { status: "visa payed" });
        // update stock
        updateStock(order.products, true);
        // clear cart
        clearCart(order.user);
        return;
    }

    await Order.findOneAndUpdate({ _id: orderId }, { status: "failed to pay" });
    return;
})

// get user Orders
export const getUserOrders = asyncHandler(async (req, res, next) => {
    // check order
    await Order.deleteMany({ user: req.user._id, status: "placed", payment: "visa" });
    const order = await Order.find({ user: req.user._id }).populate("products.productId");
    // send response
    return res.json({ success: true, message: "orders founded successfully!", results: { order } });
});

// get all Orders
export const getAllOrders = asyncHandler(async (req, res, next) => {
    // check order
    await Order.deleteMany({ status: "placed", payment: "visa" });
    const order = await Order.find();
    // send response
    return res.json({ success: true, message: "orders founded successfully!", results: { order } });
});