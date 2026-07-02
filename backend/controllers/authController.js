const User = require("../models/User");

const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const generateToken =
  require("../utils/generateToken");



// REGISTER USER
const registerUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // CHECK USER
    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {

      return res.status(400).json({
        message:
          "User already exists",
      });

    }

    // HASH PASSWORD
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );
// VALIDATE ROLE
const validRoles = ["Team Manager", "Team Leader", "Team Member"];
const assignedRole = validRoles.includes(role) ? role : "Team Member";

if (assignedRole === "Team Leader" || assignedRole === "Team Member") {
  return res.status(403).json({
    message: "Only Team Managers can register accounts publicly. Team Leaders and Team Members must be created by a Team Manager.",
  });
}

    // CREATE USER
    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword,

        role: assignedRole,

        teamId: "",

      });

    if (user.role === "Team Manager") {
      user.teamId = user._id.toString();
      await user.save();
    }

    // RESPONSE
    res.status(201).json({

      _id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      token:
        generateToken(user._id),

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};



// LOGIN USER
const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const user =
  await User.findOne({
    email,
  });

// CHECK ACTIVE STATUS
if (
  user &&
  !user.isActive
) {

  return res.status(403).json({

    message:
      "Account is inactive. Contact Admin.",

  });

}

if (

  user &&

  await bcrypt.compare(
    password,
    user.password
  )

) {

      res.json({

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        token:
          generateToken(user._id),

      });

    } else {

      res.status(401).json({

        message:
          "Invalid Email or Password",

      });

    }

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};



// FORGOT PASSWORD
const forgotPassword =
  async (req, res) => {

    try {

      const user =
        await User.findOne({

          email:
            req.body.email,

        });

      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }

      // TOKEN
      const resetToken =

        crypto
          .randomBytes(20)
          .toString("hex");

      user.resetPasswordToken =
        resetToken;

      user.resetPasswordExpire =

        Date.now() +
        15 * 60 * 1000;

      await user.save();

      res.json({

        message:
          "Reset token generated",

        resetToken,

      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  };



// RESET PASSWORD
const resetPassword =
  async (req, res) => {

    try {

      const user =
        await User.findOne({

          resetPasswordToken:
            req.params.token,

          resetPasswordExpire: {
            $gt: Date.now(),
          },

        });

      if (!user) {

        return res.status(400).json({

          message:
            "Invalid or expired token",

        });

      }

      // HASH NEW PASSWORD
      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(

          req.body.password,

          salt

        );

      // CLEAR RESET FIELDS
      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpire =
        undefined;

      await user.save();

      res.json({

        message:
          "Password reset successful",

      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  };
  // GET USERS
const getUsers =
  async (req, res) => {

    try {

      const users =
        await User.find()

          .select("-password");



      res.json(users);

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

};

const updateUser =
  async (req, res) => {

    try {

      const user =
        await User.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }

        );

      res.json(user);

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

};

const deleteUser =
  async (req, res) => {

    try {

      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({

        message:
          "User Deleted",

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

};

module.exports = {

  registerUser,

  loginUser,

  forgotPassword,

  resetPassword,

  getUsers,

  updateUser,

  deleteUser,

};