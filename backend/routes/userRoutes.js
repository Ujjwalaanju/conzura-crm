const express =
  require("express");

const router =
  express.Router();

const {

  getUsers,

  createUser,
  
  updateUser,

  deleteUser,

} = require(
  "../controllers/userController"
);

const {

  protect,

  adminOnly,

} = require(
  "../middleware/authMiddleware"
);


// GET USERS
router.get(
  "/",
  protect,
  (req, res, next) => {
    if (
      req.user.role === "Team Manager" ||
      req.user.role === "Team Leader" ||
      req.user.role === "Admin" ||
      req.user.role === "SuperAdmin"
    ) {
      return next();
    }
    return res.status(403).json({ message: "Access Denied" });
  },
  getUsers
);

// CREATE USER
router.post(
  "/",
  protect,
  adminOnly,
  createUser
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateUser
);

// DELETE USER
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports =
  router;