const express = require("express");
const router = express.Router();

const Lead = require("../models/Lead");
const Task = require("../models/Task");
const Ticket = require("../models/Ticket");

// REPORTS API
router.get("/", async (req, res) => {
  try {
    // TOTALS
    const totalLeads = await Lead.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalTickets = await Ticket.countDocuments();

    // PIPELINE
    const newLeads = await Lead.countDocuments({
      status: "New",
    });

    const wonLeads = await Lead.countDocuments({
      status: "Won",
    });

    // CUSTOMERS
    const totalCustomers = wonLeads;

    // REVENUE
    const revenue = wonLeads * 50000;

    // CONVERSION RATE
    const conversionRate =
      totalLeads > 0
        ? ((wonLeads / totalLeads) * 100).toFixed(1)
        : 0;

    res.json({
      totalLeads,
      totalTasks,
      totalTickets,
      totalCustomers,
      revenue,
      conversionRate,

      // PIPELINE
      newLeads,
      wonLeads,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;