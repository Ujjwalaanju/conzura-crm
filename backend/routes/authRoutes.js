const express =
  require("express");

const router =
  express.Router();

const {

  registerUser,

  loginUser,

  forgotPassword,

  resetPassword,

  getUsers,

} = require(
  "../controllers/authController"
);

const {

  protect,

  adminOnly,

} = require(
  "../middleware/authMiddleware"
);



// REGISTER
router.post(
  "/register",
  registerUser
);



// LOGIN
router.post(
  "/login",
  loginUser
);



// FORGOT PASSWORD
router.post(
  "/forgot-password",
  forgotPassword
);



// RESET PASSWORD
router.put(
  "/reset-password/:token",
  resetPassword
);



// GET USERS
router.get(
  "/users",
  protect,
  getUsers
);



module.exports =
  router;