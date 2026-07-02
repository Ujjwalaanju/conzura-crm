// scripts/updateRoles.js
const mongoose = require("mongoose");
const User = require("../models/User"); // adjust path if your User model is elsewhere

async function updateRoles() {
  try {
    await mongoose.connect("mongodb://localhost:27017/YourDatabaseName");

    // SalesManager, Admin, SuperAdmin → Team Manager
    await User.updateMany(
      { role: { $in: ["SalesManager", "Admin", "SuperAdmin"] } },
      { $set: { role: "Team Manager" } }
    );

    // SupportExecutive → Team Leader
    await User.updateMany(
      { role: "SupportExecutive" },
      { $set: { role: "Team Leader" } }
    );

    // SalesExecutive → Team Member
    await User.updateMany(
      { role: "SalesExecutive" },
      { $set: { role: "Team Member" } }
    );

    console.log("✅ Roles updated successfully!");

    // Verify changes
    const users = await User.find({}, { name: 1, role: 1 });
    console.log("Updated users:", users);

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error updating roles:", error);
    mongoose.disconnect();
  }
}

updateRoles();
