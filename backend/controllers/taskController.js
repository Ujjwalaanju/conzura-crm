const Task =
  require("../models/Task");

const Notification =
  require("../models/Notification");

// GET TASKS
const getTasks =
  async (req, res) => {

    try {

      const tasks =
        await Task.find()

        .sort({

          createdAt: -1,

        });

      res.json(tasks);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};

// ADD TASK
const addTask =
  async (req, res) => {

    try {

      const task =
        await Task.create({

          title:
            req.body.title || "",

          description:
            req.body.description || "",

          assignedTo:
            req.body.assignedTo || "",

          priority:
            req.body.priority || "Medium",

          status:
            req.body.status || "Pending",

          dueDate:
            req.body.dueDate || null,

          createdBy:
            req.user?._id || null,

        });

      // CREATE NOTIFICATION
      await Notification.create({

        title:
          "New Task",

        message:
          `Task created: ${task.title}`,

        type:
          "Task",

        priority:
          task.priority,

      });

      res.status(201).json(
        task
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};

// DELETE TASK
const deleteTask =
  async (req, res) => {

    try {

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {

        return res.status(404).json({

          message:
            "Task not found",

        });

      }

      await Task.findByIdAndDelete(

        req.params.id

      );

      // DELETE NOTIFICATION
      await Notification.create({

        title:
          "Task Deleted",

        message:
          `Task deleted: ${task.title}`,

        type:
          "Task",

        priority:
          "Low",

      });

      res.json({

        message:
          "Task deleted",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};

// UPDATE TASK
const updateTask =
  async (req, res) => {

    try {

      const updatedTask =
        await Task.findByIdAndUpdate(

          req.params.id,

          req.body,

          { new: true }

        );

      // UPDATE NOTIFICATION
      await Notification.create({

        title:
          "Task Updated",

        message:
          `${updatedTask.title} updated`,

        type:
          "Task",

        priority:
          updatedTask.priority,

      });

      res.json(updatedTask);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};

// OVERDUE TASKS
const getOverdueTasks =
  async (req, res) => {

    try {

      const overdueTasks =
        await Task.find({

          dueDate: {
            $lt: new Date(),
          },

          status: {
            $ne: "Completed",
          },

        });

      res.json(overdueTasks);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};

module.exports = {

  getTasks,

  addTask,

  deleteTask,

  updateTask,

  getOverdueTasks,

};