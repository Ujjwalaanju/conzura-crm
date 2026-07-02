const express =
  require("express");

const router =
  express.Router();

const Notification =
  require("../models/Notification");

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);
const {

  createNotification,

  getNotifications,

  markAsRead,

  deleteNotification,

} = require(

  "../controllers/notificationController"

);
// CREATE NOTIFICATION
router.post(

  "/",

  protect,

  createNotification

);


// GET NOTIFICATIONS
router.get(

  "/",

  protect,

  async (req, res) => {

    try {

      const notifications =

        await Notification.find()

          .sort({

            createdAt: -1,

          });



      res.json(
        notifications
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }

);



// MARK READ
router.put(

  "/:id",

  protect,

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
        
      res.json(
        notification
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      });

    }

  }

);
router.delete(
  "/:id",
  deleteNotification
);

const sendWhatsApp =
  require(
    "../services/whatsappService"
  );



module.exports =
  router;