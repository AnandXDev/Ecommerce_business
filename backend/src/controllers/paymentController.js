const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product"); // ✅ ADD THIS
const Cart = require("../models/Cart"); // ✅ ALSO ADD (you used it later)
const asyncHandler = require("../middleware/asyncHandler");

// Initialize Razorpay only if keys are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
exports.createRazorpayOrder = asyncHandler(async (req, res, next) => {
  console.log("🔹 CREATE RAZORPAY ORDER DEBUG ===");
  console.log("🔹 Request body:", req.body);
  console.log("🔹 Request headers:", req.headers);
  console.log("🔹 User:", req.user?.email);


  const session = await mongoose.startSession();
session.startTransaction();

try {
  // all DB operations with { session }

  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
}
  if (!razorpay) {
    console.log("❌ Razorpay not configured");
    return res.status(500).json({
      success: false,
      message: "Payment service not configured",
    });
  }

  const { amount, currency, receipt, notes } = req.body;
  console.log("🔹 Parsed data:", { amount, currency, receipt, notes });

  if (!amount || amount <= 0) {
    console.log("❌ Invalid amount:", amount);
    return res.status(400).json({
      success: false,
      message: "Invalid amount",
    });
  }

  const options = {
    // Convert rupees to paise for Razorpay
    amount: Math.round(amount * 100), // ✅ FIXED,
    currency: currency || "INR",
    receipt: receipt || `receipt_${Date.now()}`,
    notes: notes || {},
    payment_capture: 1,
  };

  console.log("🔹 Razorpay options:", options);

  try {
    console.log("🔹 Creating Razorpay order...");
    const razorpayOrder = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", razorpayOrder);

    res.status(200).json({
      success: true,
      data: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        notes: razorpayOrder.notes,
      },
    });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("🔥 Razorpay order creation error:", error);
    console.error("🔥 Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
  console.log("🔹 CREATE RAZORPAY ORDER COMPLETE ===");
});

// const existingOrder =  Order.findOne({
//   "paymentDetails.transactionId": razorpay_payment_id,
// });

// if (existingOrder) {
//   return res.status(200).json({
//     success: true,
//     message: "Order already exists",
//     data: existingOrder,
//   });
// }
// @desc    Verify Razorpay payment and create order
// @route   POST /api/payments/verify
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  console.log("🔹 VERIFY PAYMENT DEBUG ===");
  console.log("🔹 Request body:", req.body);
  console.log("🔹 User:", req.user?.email);

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    shippingInfo,
    billingInfo,
    totalAmount,
    paymentMethod,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !shippingInfo ||
    !billingInfo ||
    !Array.isArray(items)
  ) {
    console.log("Request body:", req.body);
    console.log("❌ Missing required data");
    return res.status(400).json({
      success: false,
      message: "Missing required payment data",
    });
  }

  // Generate and verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  console.log("🔹 Generated signature:", expectedSignature);
  console.log("🔹 Received signature:", razorpay_signature);

  if (expectedSignature !== razorpay_signature) {
    console.log("❌ Signature mismatch");
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  try {
    console.log("🔹 Fetching payment from Razorpay...");
    // Fetch payment details from Razorpay to confirm it's captured
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (err) {
      console.error("❌ Razorpay fetch error:", err);
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID",
      });
    }
    console.log("🔹 Razorpay payment details:", payment);

    if (payment.status !== "captured") {
      console.log("❌ Payment not captured, status:", payment.status);
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    console.log("✅ Payment captured successfully");

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, "0")}`;
    console.log("🔹 Generated order number:", orderNumber);

    // Calculate totals
    

  let subtotal = 0;
const orderItems = [];

for (const item of items) {
  // ✅ FIX LINE 1
  const product = await Product.findById(item.productId);

  // ✅ FIX LINE 2
  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product ${item.productId} not found`,
    });
  }

  // ✅ FIX LINE 3
  const itemTotal = item.quantity * product.pricing.basePrice;
  subtotal += itemTotal;

  orderItems.push({
    product: product._id,
    variant: item.variant || {},
    quantity: item.quantity,
    price: product.pricing.basePrice,
    comparePrice: product.pricing.comparePrice || 0,
    total: itemTotal,
    productSnapshot: {
      name: product.name,
      sku: product.sku,
      slug: product.slug,
      images: Array.isArray(product.images)
      ? product.images.map((img) => img.url)
      : [],
      supplier: product.supplier,
    },
  });

  // ✅ FIX LINE 4 (stock check)
  if (product.inventory.quantity < item.quantity) {
    throw new Error(`Insufficient stock for ${product.name}`);
  }

  // ✅ FIX LINE 5 (update stock)
  product.inventory.quantity -= item.quantity;
  await product.save();
}

    const tax = subtotal * 0.18; // 18% GST for India
    const shippingCost = subtotal > 500 ? 0 : 40; // Free shipping over ₹500
    const total = subtotal + tax + shippingCost;

    // Use totalAmount from frontend or calculate it
    const finalTotal = total; // ✅ ALWAYS USE BACKEND VALUE

    // Create order with proper structure
    const order = new Order({
      orderNumber,
      user: req.user.id,
      items: orderItems,
      shipping: {
        address: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        },
      },
      billing: {
        address: {
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          street: billingInfo.street,
          city: billingInfo.city,
          state: billingInfo.state,
          zipCode: billingInfo.zipCode,
          country: billingInfo.country,
          email: billingInfo.email,
          phone: billingInfo.phone,
        },
      },
      paymentMethod: paymentMethod || "razorpay",
      paymentStatus: "paid",
      customer: {
        email: req.user.email,
        phone: req.user.phone,
      },
      pricing: {
        subtotal,
        tax,
        shipping: shippingCost,
        total: finalTotal,
      },
      paymentDetails: {
        transactionId: razorpay_payment_id,
        paymentIntentId: razorpay_order_id,
        gateway: "razorpay",
        amount: payment.amount / 100, // Convert back to rupees
        currency: payment.currency,
        paidAt: new Date(),
      },
      status: "confirmed",
    });

    // Add timeline entry
    order.timeline.push({
      status: "confirmed",
      title: "Payment Successful",
      description: `Payment of ₹${payment.amount / 100} received via Razorpay`,
      timestamp: new Date(),
    });

    await order.save();
    console.log("✅ Order saved successfully:", order._id);

    // Clear user cart
    await Cart.findOneAndDelete({ user: req.user.id });
    console.log("✅ Cart cleared");

    console.log("🔹 Sending success response");
    res.status(200).json({
      success: true,
      message: "Payment verified and order created successfully",
      data: {
        order,
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          method: payment.method,
          captured: payment.captured,
        },
      },
    });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("🔥 Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message, // ✅ ADD THIS
      stack: error.stack, // ✅ ADD THIS (temporary)
    });
  }
  console.log("🔹 VERIFY PAYMENT COMPLETE ===");
});

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
exports.getPaymentDetails = asyncHandler(async (req, res, next) => {
  if (!razorpay) {
    return res.status(500).json({
      success: false,
      message: "Payment service not configured",
    });
  }

  const { paymentId } = req.params;

  try {
    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Fetch payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
    });
  }
});

// @desc    Refund payment
// @route   POST /api/payments/refund
exports.refundPayment = asyncHandler(async (req, res, next) => {
  if (!razorpay) {
    return res.status(500).json({
      success: false,
      message: "Payment service not configured",
    });
  }

  const { paymentId, amount, reason } = req.body;

  if (!paymentId) {
    return res.status(400).json({
      success: false,
      message: "Payment ID is required",
    });
  }

  try {
    const refundOptions = {
      amount: amount ? amount * 100 : undefined, // Convert to paise if amount provided
    };

    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    // Update order payment status
    const order = await Order.findOne({
      "paymentDetails.transactionId": paymentId,
    });
    if (order) {
      order.paymentStatus = "refunded";
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      data: refund,
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({
      success: false,
      message: "Refund failed",
    });
  }
});

// @desc    Get Razorpay key (for frontend)
// @route   GET /api/payments/key
exports.getRazorpayKey = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      key: process.env.RAZORPAY_KEY_ID,
    },
  });
});
