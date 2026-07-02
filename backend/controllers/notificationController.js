const Notification =
  require("../models/Notification");

const sendWhatsApp =
  require(
    "../services/whatsappService"
  );
  const sendEmail =
  require(
    "../services/emailService"
  );

  const sendSMS =
  require(
    "../services/smsService"
  );
// CREATE NOTIFICATION
const createNotification =
  async (req, res) => {

    try {

      const notification =
        await Notification.create({

          title:
            req.body.title ||
            "CRM Alert",

          message:
            req.body.message || "",

          type:
            req.body.type || "General",

          priority:
            req.body.priority || "Medium",

            phone:
            req.body.phone,

          email:
            req.body.email,

          read:
            false,

        });
        console.log(
  req.body.phone
);

await sendSMS(

  req.body.phone,

  notification.message

);
await sendEmail(

  req.body.email,

  notification.title,

  notification.message

);
// SEND WHATSAPP ALERT
await sendWhatsApp(

  req.body.phone,

  `🚨 CRM ALERT

${notification.title}

${notification.message}`

);

const io =
  req.app.get("io");

io.emit(

  "newNotification",

  notification

);
      res.status(201).json(

        notification

      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};


// GET ALL NOTIFICATIONS
const getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find()

        .sort({

          createdAt: -1,

        });

      res.status(200).json(

        notifications

      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};


// MARK AS READ
const markAsRead =
  async (req, res) => {

    try {

      const notification =

        await Notification.findByIdAndUpdate(

          req.params.id,

          {
            read: true,
          },

          {
            new: true,
          }

        );

      if (!notification) {

        return res.status(404).json({

          message:
            "Notification not found",

        });

      }

      res.status(200).json(

        notification

      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};


// DELETE NOTIFICATION
const deleteNotification =
  async (req, res) => {

    try {

      const notification =
        await Notification.findById(

          req.params.id

        );

      if (!notification) {

        return res.status(404).json({

          message:
            "Notification not found",

        });

      }

      await Notification.findByIdAndDelete(

        req.params.id

      );

      res.status(200).json({

        message:
          "Notification Deleted",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};


// GET UNREAD COUNT
const getUnreadCount =
  async (req, res) => {

    try {

      const count =
        await Notification.countDocuments({

          read: false,

        });

      res.status(200).json({

        unread:
          count,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};


// GET CRITICAL ALERTS
const getCriticalAlerts =
  async (req, res) => {

    try {

      const alerts =
        await Notification.find({

          priority:
            "Critical",

        }).sort({

          createdAt: -1,

        });

      res.status(200).json(

        alerts

      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};


// MARK ALL AS READ
const markAllAsRead =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {

          read: false,

        },

        {

          read: true,

        }

      );

      res.status(200).json({

        message:
          "All Notifications Read",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,

      });

    }

};


module.exports = {

  createNotification,

  getNotifications,

  markAsRead,

  deleteNotification,

  getUnreadCount,

  getCriticalAlerts,

  markAllAsRead,

};