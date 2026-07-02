const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getPayments,
  updateTotalPayment,
  addPaymentTransaction,
} = require("../controllers/paymentController");

// GET ALL PAYMENTS
router.get("/", protect, getPayments);

// UPDATE TOTAL PAYMENT (Only Admin)
router.put("/:id", protect, updateTotalPayment);

// ADD PAYMENT TRANSACTION (Pay)
router.post("/:id/pay", protect, addPaymentTransaction);

module.exports = router;
