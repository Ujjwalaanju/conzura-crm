const Project = require("../models/Project");

// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROJECT DETAILS (Only Admin & Team Manager)
const updateProject = async (req, res) => {
  const user = req.user;
  if (user.role !== "Admin" && user.role !== "Team Manager") {
    return res.status(403).json({ message: "Access Denied: Only Managers and Admins can update projects" });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  updateProject,
};
