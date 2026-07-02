const Payment = require("../models/Payment");

// GET ALL PAYMENTS
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ convertedAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TOTAL PAYMENT (Only Admin)
const updateTotalPayment = async (req, res) => {
  const user = req.user;
  if (user.role !== "Admin") {
    return res.status(403).json({ message: "Access Denied: Only Admin can update total payment" });
  }

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    payment.totalPayment = Number(req.body.totalPayment) || 0;
    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD PAYMENT TRANSACTION (Pay)
const addPaymentTransaction = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Please enter a valid payment amount" });
    }

    payment.paidAmount = Number(payment.paidAmount || 0) + Number(amount);
    payment.paymentHistory.push({
      date: new Date().toLocaleDateString(),
      amount: Number(amount),
    });

    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  updateTotalPayment,
  addPaymentTransaction,
};
