const express = require("express");

const {

  getTasks,

  addTask,

  deleteTask,

  updateTask,

  getOverdueTasks,

} = require(
  "../controllers/taskController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();



// GET ALL TASKS
router.get(
  "/",
  protect,
  getTasks
);



// OVERDUE TASKS
router.get(
  "/overdue",
  protect,
  getOverdueTasks
);



// ADD TASK
router.post(
  "/",
  protect,
  addTask
);



// DELETE TASK
router.delete(
  "/:id",
  protect,
  deleteTask
);



// UPDATE TASK
router.put(
  "/:id",
  protect,
  updateTask
);



module.exports = router;