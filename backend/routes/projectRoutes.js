const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getProjects, updateProject } = require("../controllers/projectController");

// GET ALL PROJECTS
router.get("/", protect, getProjects);

// UPDATE PROJECT DETAILS
router.put("/:id", protect, updateProject);

module.exports = router;
