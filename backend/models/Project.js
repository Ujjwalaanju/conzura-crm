const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    projectTitle: {
      type: String,
    },
    status: {
      type: String,
      enum: ["In Progress", "Completed", "Delivered"],
      default: "In Progress",
    },
    assignedTo: {
      type: String,
      default: "",
    },
    deliveryDate: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
    completedPercent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
