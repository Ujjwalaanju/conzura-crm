const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET USERS
const getUsers = async (req, res) => {
  const user = req.user; // decoded from token

  try {
    let users;

    if (user.role === "Admin") {
      // Admin sees all users
      users = await User.find().select("-password");
    } else if (user.role === "Team Manager") {
      // Manager sees only their own team members
      users = await User.find({ teamId: user.teamId }).select("-password");
    } else if (user.role === "Team Leader") {
      // Leader sees only their team members (which should be Team Members)
      users = await User.find({ teamId: user.teamId, role: "Team Member" }).select("-password");
    } else if (user.role === "Team Member") {
      // Member sees only themselves
      users = await User.find({ _id: user._id }).select("-password");
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE USER (only Admin or Team Manager)
const createUser = async (req, res) => {
  const user = req.user;

  if (user.role !== "Admin" && user.role !== "Team Manager") {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const { name, email, password, role, phone } = req.body;

    // Check permissions on role creation
    if (role === "Team Manager" || role === "Admin") {
      if (user.role !== "Admin") {
        return res.status(403).json({ message: "Only Admin can create Manager or Admin accounts" });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || "123456", salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      teamId: role === "Team Manager" ? "" : (user.role === "Admin" ? (req.body.teamId || "admin_team") : user.teamId),
    });

    if (newUser.role === "Team Manager") {
      newUser.teamId = newUser._id.toString();
      await newUser.save();
    }

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      teamId: newUser.teamId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER (Admin or Team Manager)
const updateUser = async (req, res) => {
  const user = req.user;

  if (user.role !== "Admin" && user.role !== "Team Manager") {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify target user is in manager's team
    if (user.role !== "Admin" && targetUser.teamId !== user.teamId) {
      return res.status(403).json({ message: "Access Denied: Not in your team" });
    }

    const { role, password } = req.body;

    if (role) {
      const validRoles = ["Admin", "Team Manager", "Team Leader", "Team Member"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role value" });
      }
      if ((role === "Team Manager" || role === "Admin") && user.role !== "Admin") {
        return res.status(403).json({ message: "Access Denied: Only Admin can update to Manager or Admin role" });
      }
    }

    const updateData = { ...req.body };

    // If password is being updated, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER (Admin or Team Manager)
const deleteUser = async (req, res) => {
  const user = req.user;

  if (user.role !== "Admin" && user.role !== "Team Manager") {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "Admin" && targetUser.teamId !== user.teamId) {
      return res.status(403).json({ message: "Access Denied: Not in your team" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
