const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const Task = require("../models/Task");

const getReportStats = async (req, res) => {
  try {
    // TOTALS
    const totalLeads = await Lead.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalTasks = await Task.countDocuments();

    // PIPELINE
    const newLeads = await Lead.countDocuments({
      status: "New",
    });

    const wonLeads = await Lead.countDocuments({
      status: "Won",
    });

    // TASKS
    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });

    const pendingTasks = await Task.countDocuments({
      status: "Pending",
    });

    // CONVERSION
    const conversionRate =
      totalLeads > 0
        ? ((wonLeads / totalLeads) * 100).toFixed(1)
        : 0;

    // REVENUE
    const revenue = wonLeads * 5000;

    res.json({
      totalLeads,
      totalCustomers,
      totalTasks,
      revenue,
      conversionRate,

      // PIPELINE
      newLeads,
      wonLeads,

      // TASKS
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getReportStats,
};