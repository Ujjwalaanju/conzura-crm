const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    projectTitle: {
      type: String,
    },
    purpose: {
      type: String,
      default: "Internship",
    },
    totalPayment: {
      type: Number,
      default: 5000,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    convertedAt: {
      type: Date,
      default: Date.now,
    },
    paymentHistory: [
      {
        date: {
          type: String,
        },
        amount: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
