const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // NAME
    name: {
      type: String,
      required: true,
    },

   email: {
  type: String,
  unique: true,
  sparse: true,
},

phone: {
  type: String,
  unique: true,
  sparse: true,
},

    // COMPANY
    company: {
      type: String,
    },

    // STATUS
   status: {
  type: String,
  enum: ["New", "Won"],
  default: "New",
   },


    // ✅ NEW FIELDS
    projectTitle: {
      type: String,
      default: "",
    },

    purpose: {
      type: String,
      default: "",
    },

    paymentAmount: {
      type: Number,
      default: 0,
    },

    // ASSIGNED EMPLOYEE
    assignedTo: {
      type: String,
    },

    // NOTES
    notes: [
      {
        text: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // CREATED BY
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);
